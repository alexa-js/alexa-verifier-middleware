var expect = require('chai').expect,
    opensslTools = require('../main.js');

var expectedCertificate =
'-----BEGIN CERTIFICATE-----\n' +
'MIIFXDCCBESgAwIBAgIRAOohfOpsH5eeapGQt2hS1mMwDQYJKoZIhvcNAQELBQAw\n' +
'gZAxCzAJBgNVBAYTAkdCMRswGQYDVQQIExJHcmVhdGVyIE1hbmNoZXN0ZXIxEDAO\n' +
'BgNVBAcTB1NhbGZvcmQxGjAYBgNVBAoTEUNPTU9ETyBDQSBMaW1pdGVkMTYwNAYD\n' +
'VQQDEy1DT01PRE8gUlNBIERvbWFpbiBWYWxpZGF0aW9uIFNlY3VyZSBTZXJ2ZXIg\n' +
'Q0EwHhcNMTQwODIyMDAwMDAwWhcNMTkwODIxMjM1OTU5WjBeMSEwHwYDVQQLExhE\n' +
'b21haW4gQ29udHJvbCBWYWxpZGF0ZWQxHTAbBgNVBAsTFFBvc2l0aXZlU1NMIFdp\n' +
'bGRjYXJkMRowGAYDVQQDFBEqLnljb21iaW5hdG9yLmNvbTCCASIwDQYJKoZIhvcN\n' +
'AQEBBQADggEPADCCAQoCggEBALx/P2v0mskx+1pp0muEIgarzbJwg/4ls5k+lnZa\n' +
'z56E7XUsRua2ZconP0TQJg13RmRHdo9vQ5I8vHxuNnYPcrhfpFKjBnVEmg0WxvoC\n' +
'6kevI4vbspg+Wgt2eTKZ7e/SVVe8RyiKqzJkMo8OEaQpFLDptPxd/pISJGFvu/Fd\n' +
'17BypU4AHz47kBJNFdIKjK2GbOTTpd90V1HhKvvDQzxR5WXHDTrFNZtZZNtdKivc\n' +
'Cv0vPfrQbBqIFJi3cKzv4CHgk4MS0pB/pxfVDFmdB77UE/STFzreLpjcAXjG+E9R\n' +
'eGKWOT6sBw1ec7YgO/yZ0Tg+a9k/a54jgKTVTGeIdXJ86fECAwEAAaOCAeAwggHc\n' +
'MB8GA1UdIwQYMBaAFJCvajqUWgvYkOoSVnPfQ7Q6KNrnMB0GA1UdDgQWBBTUXtbT\n' +
'/H0se44t7QPf82TCOQ7OWjAOBgNVHQ8BAf8EBAMCBaAwDAYDVR0TAQH/BAIwADAd\n' +
'BgNVHSUEFjAUBggrBgEFBQcDAQYIKwYBBQUHAwIwUAYDVR0gBEkwRzA7BgwrBgEE\n' +
'AbIxAQIBAwQwKzApBggrBgEFBQcCARYdaHR0cHM6Ly9zZWN1cmUuY29tb2RvLm5l\n' +
'dC9DUFMwCAYGZ4EMAQIBMFQGA1UdHwRNMEswSaBHoEWGQ2h0dHA6Ly9jcmwuY29t\n' +
'b2RvY2EuY29tL0NPTU9ET1JTQURvbWFpblZhbGlkYXRpb25TZWN1cmVTZXJ2ZXJD\n' +
'QS5jcmwwgYUGCCsGAQUFBwEBBHkwdzBPBggrBgEFBQcwAoZDaHR0cDovL2NydC5j\n' +
'b21vZG9jYS5jb20vQ09NT0RPUlNBRG9tYWluVmFsaWRhdGlvblNlY3VyZVNlcnZl\n' +
'ckNBLmNydDAkBggrBgEFBQcwAYYYaHR0cDovL29jc3AuY29tb2RvY2EuY29tMC0G\n' +
'A1UdEQQmMCSCESoueWNvbWJpbmF0b3IuY29tgg95Y29tYmluYXRvci5jb20wDQYJ\n' +
'KoZIhvcNAQELBQADggEBAGKbb49GhIPWAAl0TmgngSKGKYCI4ejjdPIwRy82vRzG\n' +
'f9wUuu8oDziBI7ac2z9H/8YjUjQlV3TcVmIDrX0TGcqXKPD1CbHmTf4PFXjCLe4r\n' +
'bb0gnLutHYCXTsfsOBcLFM/2WOrV5LSZoyhRHtk1Pa5Pju/BAuXN93dWd1fMm1Vs\n' +
'mm9+XAuuuZv5VSmuzu0bUOad0q5IlAv1qDfnedWyF1lNrTQMYUdw4UWYswiOLOK2\n' +
'arMaytbB6iehx/ihg344LgTC1xkAFKgIfNSOqbFj1mAD3EffXNqOYni2BcWHK+JD\n' +
'Yhads5CYvphCHmtsYRWY7HQL7Al0GXLqTtoJ+Lqw2Uo=\n' +
'-----END CERTIFICATE-----';

describe('openssl-cert-tools test cases', function() {
  describe('getCertificate', function() {
    it('should return the expected certficate of news.ycombinator.com', function(done) {
      opensslTools.getCertificate('news.ycombinator.com', '443', function(err, crt){
        if (err) {
          console.log(err);
        } else {
          expect(crt).to.deep.equal(expectedCertificate);
          done();
        }
      });
    });

    it('should return error, because the port 65536 doesn\'t exist', function(done) {
      opensslTools.getCertificate('localhost', '65536', function(err, crt){
        if (err) {
          expect(err.toString()).to.contains('Error');
          done();
        } else {
          console.log(crt);
        }
      });
    });

    it('should run into timeout, because no HTTPS on news.ycombinator.com:444', function(done) {
      opensslTools.getCertificate('news.ycombinator.com', '444', function(err, crt){
        if (err) {
          expect(err.toString()).to.contains('Time out while trying to extract');
          done();
        } else {
          console.log(crt);
        }
      });
    });

  });
});
