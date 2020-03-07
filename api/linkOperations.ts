import { ILinkBundle } from "./Model/ILinkBundle";
import { ValidationResult } from "./Model/ValidationResult";
import { HttpRequest } from "@azure/functions";
import * as crypto from "crypto";

const CHARACTERS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export default {
  async ensureVanity(
    linkDocument: ILinkBundle,
    req: HttpRequest
  ): Promise<string> {
    let vanityUrl = linkDocument.vanityUrl || "";

    // if the vanity URL is an empty string (was not specified by the user)
    // we need to generate a random one
    if (vanityUrl === "") {
      const code: Array<string> = new Array(7);

      // This function uses the crypto library to generate a random numeric value.
      // It then converts that random number to a 32 bit integer and divides it by the number
      // of characters in the CHARACTER string (specified at the top of this file).
      // This yields a number between 0 and 61.
      // Finally, it uses that number to choose a character from the CHARACTER string by index.
      // This is done 7 times yielding a random vanityUrl string that is 7 characters in length.
      function getRandomChar() {
        return new Promise((resolve, reject) => {
          let randomValues = crypto.randomBytes(48, (err, buffer) => {
            if (err) reject(err);

            let num = Math.abs(buffer.readInt32BE(0) % CHARACTERS.length);
            resolve(CHARACTERS[num]);
          });
        });
      }

      for (let i = 0; i < code.length; i++) {
        try {
          vanityUrl += await getRandomChar();
        } catch (err) {
          throw {
            title: "Could not create link bundle",
            detail: "Unable to generate random vanityUrl",
            status: 400,
            type: "/theurlist/clientissue",
            instance: req.url
          };
        }
      }
    }

    return vanityUrl.toLowerCase();
  },

  validateVanity(
    linkDocument: ILinkBundle,
    req: HttpRequest
  ): ValidationResult {
    /* This regex says the vanityUrl can be
     * Any number
     * Any letter
     * Any of the following symbols: -
     * The "i" means "case insensitive"
     */
    const isValid = RegExp("^[\\w\\d-]+$", "i").test(linkDocument.vanityUrl);

    return new ValidationResult(isValid, {
      title: "Could not create link bundle",
      detail: "Vanity link is invalid",
      status: 400,
      type: "/theurlist/clientissue",
      instance: req.url
    });
  },

  validateLinks(linkDocument: ILinkBundle, req: HttpRequest): ValidationResult {
    // TODO: Replace with optional chaining when that's available in TS stable
    const isValid: boolean =
      linkDocument && linkDocument.links && linkDocument.links.length > 0;

    return new ValidationResult(isValid, {
      title: "Payload is invalid",
      detail: "No links provided",
      status: 400,
      type: "/theurlist/clientissue",
      instance: req.url
    });
  }
};
