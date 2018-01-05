const expect = require( "expect" );
const sinon = require( "sinon" );
const mockery = require( "mockery" );

/* global describe it */

mockery.enable( {
  warnOnUnregistered: false,
} );

const tokenStates = {
  token         : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImpuZWlkZWwiLCJpYXQiOjE1MTUxNDIyNTJ9._chGR5i3ToikSc76ZpkkRs5UyXbP2Etl8Hdp1Jr_Yr8",
  encryptedToken: "GeWMX+TuKuKnNjKwXb6Cvhmvc2EaxByOWjC/8aTs1J+lAak/C8LAs6y99fRb4+0P1xUjMPUbZ/gguaqomG7t+GEjx2jZrEjcG/jtR+XwZx1iZyi4JyARwTRyT3OkCWSqsUFzzehggcxG8B2F9hvvzPm39lxNVMmXWrcEF+aQoJYRgTRh/T7x9pOnOJFcoMVzQPMgRtwZML9WxVVIiPjXt8+SBNg06buBSLdZptsMMKXFMico4/nHhlTxLrFBLt0bkY7uEdaeS9l1lazM71LVmnH8dw5eBtALZIdzXGnvOvD5BJyNS5Fy9AtfFM+YooQjXJ74xDSOOR1hjc+m62jVrA==",
  parsedToken   : "R2VXTVgrVHVLdUtuTmpLd1hiNkN2aG12YzJFYXhCeU9XakMvOGFUczFKK2xBYWsvQzhMQXM2eTk5ZlJiNCswUDF4VWpNUFViWi9nZ3VhcW9tRzd0K0dFangyalpyRWpjRy9qdFIrWHdaeDFpWnlpNEp5QVJ3VFJ5VDNPa0NXU3FzVUZ6emVoZ2djeEc4QjJGOWh2dnpQbTM5bHhOVk1tWFdyY0VGK2FRb0pZUmdUUmgvVDd4OXBPbk9KRmNvTVZ6UVBNZ1J0d1pNTDlXeFZWSWlQalh0OCtTQk5nMDZidUJTTGRacHRzTU1LWEZNaWNvNC9uSGhsVHhMckZCTHQwYmtZN3VFZGFlUzlsMWxhek03MUxWbW5IOGR3NWVCdEFMWklkelhHbnZPdkQ1Qkp5TlM1Rnk5QXRmRk0rWW9vUWpYSjc0eERTT09SMWhqYyttNjJqVnJBPT0=",
};

const rsaObj = {
  importKey: sinon.spy(),
  encrypt  : sinon.stub(),
};
class rsa {
  constructor() {
    return rsaObj;
  }
}
rsaObj.encrypt.returns( tokenStates.encryptedToken );

const btoa = sinon.stub();
btoa.returns( tokenStates.parsedToken );

mockery.registerMock( "node-rsa", rsa );
mockery.registerMock( "btoa", btoa );

const controller = require( "../controllers/encryptionController" );

describe( "encryptionController", () => {
  describe( "encryptToken", () => {
    const req = {
      token: tokenStates.token,
      run: sinon.spy(),
    };

    it( "should encrypt and parse token", async () => {
      await controller.encryptToken( req, {}, () => {} );

      expect( rsaObj.importKey.callCount ).toBe( 1, "expected to import public key" );
      expect( rsaObj.encrypt.calledWith( tokenStates.token, "base64" ) ).toBeTruthy( "expected to encrypt token with public key" );
      expect( btoa.calledWith( tokenStates.encryptedToken ) ).toBeTruthy( "expected to parse encrypted token" );
      expect( req.token ).toBe( tokenStates.parsedToken, "expected parsed token as output" );
    } );
  } );
} );
