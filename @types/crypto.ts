/**
 * A transportable signed token is a package that contains an token and its signature
 * as well as the headers of the package and the signature of the package.
 * 
 * The headers are encoded as base64 and the signature is a string.
 */
export interface TransportableSignedToken {

  /**
   * The headers of the package encoded as base64
   */
  readonly headers: string;

  /**
   * The signature of the package
   */
  readonly signature: string;

  /**
   * The payload of the package including the token
   */
  readonly token: {
    /**
     * The target token transported by this package
     */
    readonly value: string;

    /**
     * The signature of the token transported by this package
     */
    readonly signature: string;
  };
}
