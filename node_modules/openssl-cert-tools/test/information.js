var expect = require('chai').expect,
    opensslTools = require('../main.js');

var testCertificate =
'-----BEGIN CERTIFICATE-----\n' +
'MIIGLzCCBdagAwIBAgIQH3be7EHzH3zHdBvhyXC4wDAKBggqhkjOPQQDAjCBkjEL\n' +
'MAkGA1UEBhMCR0IxGzAZBgNVBAgTEkdyZWF0ZXIgTWFuY2hlc3RlcjEQMA4GA1UE\n' +
'BxMHU2FsZm9yZDEaMBgGA1UEChMRQ09NT0RPIENBIExpbWl0ZWQxODA2BgNVBAMT\n' +
'L0NPTU9ETyBFQ0MgRG9tYWluIFZhbGlkYXRpb24gU2VjdXJlIFNlcnZlciBDQSAy\n' +
'MB4XDTE1MDkyNjAwMDAwMFoXDTE1MTIzMDIzNTk1OVowazEhMB8GA1UECxMYRG9t\n' +
'YWluIENvbnRyb2wgVmFsaWRhdGVkMSEwHwYDVQQLExhQb3NpdGl2ZVNTTCBNdWx0\n' +
'aS1Eb21haW4xIzAhBgNVBAMTGnNuaTMzMjgwLmNsb3VkZmxhcmVzc2wuY29tMFkw\n' +
'EwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE/VVyjyzoogarRb9sqmpqwwAf+Kh69I9E\n' +
'5NeT/1s9nVjvEzYTnrEN3xqNrzbA/y61AbJ6Yy714OCq1ViAmBuCPaOCBDIwggQu\n' +
'MB8GA1UdIwQYMBaAFEAJYWfwvINxT94SCCxv1NQrdj2WMB0GA1UdDgQWBBT1uV7H\n' +
'fwV8Ca9MxjAiSHOEyE9EVDAOBgNVHQ8BAf8EBAMCB4AwDAYDVR0TAQH/BAIwADAd\n' +
'BgNVHSUEFjAUBggrBgEFBQcDAQYIKwYBBQUHAwIwTwYDVR0gBEgwRjA6BgsrBgEE\n' +
'AbIxAQICBzArMCkGCCsGAQUFBwIBFh1odHRwczovL3NlY3VyZS5jb21vZG8uY29t\n' +
'L0NQUzAIBgZngQwBAgEwVgYDVR0fBE8wTTBLoEmgR4ZFaHR0cDovL2NybC5jb21v\n' +
'ZG9jYTQuY29tL0NPTU9ET0VDQ0RvbWFpblZhbGlkYXRpb25TZWN1cmVTZXJ2ZXJD\n' +
'QTIuY3JsMIGIBggrBgEFBQcBAQR8MHowUQYIKwYBBQUHMAKGRWh0dHA6Ly9jcnQu\n' +
'Y29tb2RvY2E0LmNvbS9DT01PRE9FQ0NEb21haW5WYWxpZGF0aW9uU2VjdXJlU2Vy\n' +
'dmVyQ0EyLmNydDAlBggrBgEFBQcwAYYZaHR0cDovL29jc3AuY29tb2RvY2E0LmNv\n' +
'bTCCAnkGA1UdEQSCAnAwggJsghpzbmkzMzI4MC5jbG91ZGZsYXJlc3NsLmNvbYIT\n' +
'Ki4xMDAxY29ja3RhaWxzLmNvbYIRKi4xMDAxbW90ZXVycy5jb22CEiouYWxpZml0\n' +
'emdlcmFsZC5tZYINKi5hbGlrZml0ei5tZYINKi5ib3J1dC5wYXJ0eYINKi5lbGth\n' +
'c3NhLmNvbYIIKi5mcmQubW6CGyouZy1hbmQtYy1lbGVjdHJvbmljcy5jby51a4IJ\n' +
'Ki5naGFjLmRlgg4qLmtub3R0Ym95cy5ldYIaKi5tb250Z29tZXJ5dm9jYWxjb2Fj\n' +
'aC5jb22CDioubW96YWlrLmNvLmlkggsqLm1vemFpay5pZIIKKi5uZXdlci5jY4IW\n' +
'Ki5wZXJzb25hbGl6YXJibG9nLmNvbYIUKi5zd2FnZG9nd2Fsa2luZy5jb22CGSou\n' +
'dGhlZ29sZGVuYW5kY29tcGFueS5jb22CETEwMDFjb2NrdGFpbHMuY29tgg8xMDAx\n' +
'bW90ZXVycy5jb22CEGFsaWZpdHpnZXJhbGQubWWCC2FsaWtmaXR6Lm1lggtib3J1\n' +
'dC5wYXJ0eYILZWxrYXNzYS5jb22CBmZyZC5tboIZZy1hbmQtYy1lbGVjdHJvbmlj\n' +
'cy5jby51a4IHZ2hhYy5kZYIMa25vdHRib3lzLmV1ghhtb250Z29tZXJ5dm9jYWxj\n' +
'b2FjaC5jb22CDG1vemFpay5jby5pZIIJbW96YWlrLmlkgghuZXdlci5jY4IUcGVy\n' +
'c29uYWxpemFyYmxvZy5jb22CEnN3YWdkb2d3YWxraW5nLmNvbYIXdGhlZ29sZGVu\n' +
'YW5kY29tcGFueS5jb20wCgYIKoZIzj0EAwIDRwAwRAIgZzfbzLiht8LIcEwvCKIj\n' +
'xRC5hF3mcVUzAYMTsAp+PWoCIBCaOZvgDR0t7tCijM6o5N3vNHDs0vQbtQkEaQSx\n' +
'/j9A\n' +
'-----END CERTIFICATE-----';

var testCertificateRequest =
'-----BEGIN CERTIFICATE REQUEST-----\n' +
'MIIC+jCCAeICAQAwgbQxCzAJBgNVBAYTAkRFMRAwDgYDVQQIDAdCYXZhcmlhMRMw\n' +
'EQYDVQQHDApFaWJlbHN0YWR0MSUwIwYDVQQKDBxZRUFIV0hBVD8hIE1pbmVjcmFm\n' +
'dCBzZXJ2ZXJzMRQwEgYDVQQLDAtNYWlsIHN5c3RlbTEcMBoGA1UEAwwTY2hld2Jh\n' +
'Y2NhLnllYWh3aC5hdDEjMCEGCSqGSIb3DQEJARYUcG9zdG1hc3RlckB5ZWFod2gu\n' +
'YXQwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDAi9mSsi01EDc3QMCL\n' +
'lreBVzDSsICIc8w4mttgSg+cW/Hl98iDZ/awyv0hEeXLg/rybR42LHCRXyJbiuV8\n' +
'edOGbYN5ODD3di5tOmzjgJm34gmSxuzzZSe6431C9nR0BJaPwGbBoFqBO5MiWD1i\n' +
'Z7Cv3a+xJQO0gN+3PIgSMOGAD608bqJN58ewtqqYY0xM3vQCEcf40TJJc8fv1+a5\n' +
'1BM07s26L0Az5xZeIcWOqBgvBQhY0dI3QEKW5BbQDVA/OFilpbJFqCseosjz0/YG\n' +
'tS46CHGjNuViAcxeJ/IWKRWB3TCd2KhIqaEZLCVTWPqCaQ7CioITgrQW+c/qVCfv\n' +
'to6xAgMBAAGgADANBgkqhkiG9w0BAQsFAAOCAQEAu8gxx8RrQPeWvKJiY3fmTNHg\n' +
'lEDQU2vTPU+56UZEuCVztj1LdmjzFpH6biFa+C2XxkTxfeXc9OakklWlIgfP7b2Y\n' +
'RTObWPcpyDSE+yB79Lhybb4Wr3vASJJWSgwqymp5BjEj0iHeVFzvippvvyPieafr\n' +
'a31cPiG5UbOWOXpeZ73K1qBqmpRglzYouqWPA0D9e9wks71INhPL8wODRha2RZ9M\n' +
'voaVZHsm6NB+WAZzK+wznc1wLs/mVigqfjakU//VXi8opb7hTkH1/8h8Pn5uCFM7\n' +
'3UcTESfcIv3XuKeLXKQEJZtR3PQlWDb+pI7x1iUm7k0Q1KXsYysdUzq/fGTSdw==\n' +
'-----END CERTIFICATE REQUEST-----';


describe('openssl-cert-tools test cases', function() {
  describe('getCertificateInfo', function() {
    it('should return the appropriate "certificate" object', function(done) {
      opensslTools.getCertificateInfo(testCertificate, function(err, data){
        if (err) {
          console.error(err);
        } else {
          expect(data.certificate).to.deep.equal('-----BEGIN CERTIFICATE-----\nMIIGLzCCBdagAwIBAgIQH3be7EHzH3zHdBvhyXC4wDAKBggqhkjOPQQDAjCBkjEL\nMAkGA1UEBhMCR0IxGzAZBgNVBAgTEkdyZWF0ZXIgTWFuY2hlc3RlcjEQMA4GA1UE\nBxMHU2FsZm9yZDEaMBgGA1UEChMRQ09NT0RPIENBIExpbWl0ZWQxODA2BgNVBAMT\nL0NPTU9ETyBFQ0MgRG9tYWluIFZhbGlkYXRpb24gU2VjdXJlIFNlcnZlciBDQSAy\nMB4XDTE1MDkyNjAwMDAwMFoXDTE1MTIzMDIzNTk1OVowazEhMB8GA1UECxMYRG9t\nYWluIENvbnRyb2wgVmFsaWRhdGVkMSEwHwYDVQQLExhQb3NpdGl2ZVNTTCBNdWx0\naS1Eb21haW4xIzAhBgNVBAMTGnNuaTMzMjgwLmNsb3VkZmxhcmVzc2wuY29tMFkw\nEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE/VVyjyzoogarRb9sqmpqwwAf+Kh69I9E\n5NeT/1s9nVjvEzYTnrEN3xqNrzbA/y61AbJ6Yy714OCq1ViAmBuCPaOCBDIwggQu\nMB8GA1UdIwQYMBaAFEAJYWfwvINxT94SCCxv1NQrdj2WMB0GA1UdDgQWBBT1uV7H\nfwV8Ca9MxjAiSHOEyE9EVDAOBgNVHQ8BAf8EBAMCB4AwDAYDVR0TAQH/BAIwADAd\nBgNVHSUEFjAUBggrBgEFBQcDAQYIKwYBBQUHAwIwTwYDVR0gBEgwRjA6BgsrBgEE\nAbIxAQICBzArMCkGCCsGAQUFBwIBFh1odHRwczovL3NlY3VyZS5jb21vZG8uY29t\nL0NQUzAIBgZngQwBAgEwVgYDVR0fBE8wTTBLoEmgR4ZFaHR0cDovL2NybC5jb21v\nZG9jYTQuY29tL0NPTU9ET0VDQ0RvbWFpblZhbGlkYXRpb25TZWN1cmVTZXJ2ZXJD\nQTIuY3JsMIGIBggrBgEFBQcBAQR8MHowUQYIKwYBBQUHMAKGRWh0dHA6Ly9jcnQu\nY29tb2RvY2E0LmNvbS9DT01PRE9FQ0NEb21haW5WYWxpZGF0aW9uU2VjdXJlU2Vy\ndmVyQ0EyLmNydDAlBggrBgEFBQcwAYYZaHR0cDovL29jc3AuY29tb2RvY2E0LmNv\nbTCCAnkGA1UdEQSCAnAwggJsghpzbmkzMzI4MC5jbG91ZGZsYXJlc3NsLmNvbYIT\nKi4xMDAxY29ja3RhaWxzLmNvbYIRKi4xMDAxbW90ZXVycy5jb22CEiouYWxpZml0\nemdlcmFsZC5tZYINKi5hbGlrZml0ei5tZYINKi5ib3J1dC5wYXJ0eYINKi5lbGth\nc3NhLmNvbYIIKi5mcmQubW6CGyouZy1hbmQtYy1lbGVjdHJvbmljcy5jby51a4IJ\nKi5naGFjLmRlgg4qLmtub3R0Ym95cy5ldYIaKi5tb250Z29tZXJ5dm9jYWxjb2Fj\naC5jb22CDioubW96YWlrLmNvLmlkggsqLm1vemFpay5pZIIKKi5uZXdlci5jY4IW\nKi5wZXJzb25hbGl6YXJibG9nLmNvbYIUKi5zd2FnZG9nd2Fsa2luZy5jb22CGSou\ndGhlZ29sZGVuYW5kY29tcGFueS5jb22CETEwMDFjb2NrdGFpbHMuY29tgg8xMDAx\nbW90ZXVycy5jb22CEGFsaWZpdHpnZXJhbGQubWWCC2FsaWtmaXR6Lm1lggtib3J1\ndC5wYXJ0eYILZWxrYXNzYS5jb22CBmZyZC5tboIZZy1hbmQtYy1lbGVjdHJvbmlj\ncy5jby51a4IHZ2hhYy5kZYIMa25vdHRib3lzLmV1ghhtb250Z29tZXJ5dm9jYWxj\nb2FjaC5jb22CDG1vemFpay5jby5pZIIJbW96YWlrLmlkgghuZXdlci5jY4IUcGVy\nc29uYWxpemFyYmxvZy5jb22CEnN3YWdkb2d3YWxraW5nLmNvbYIXdGhlZ29sZGVu\nYW5kY29tcGFueS5jb20wCgYIKoZIzj0EAwIDRwAwRAIgZzfbzLiht8LIcEwvCKIj\nxRC5hF3mcVUzAYMTsAp+PWoCIBCaOZvgDR0t7tCijM6o5N3vNHDs0vQbtQkEaQSx\n/j9A\n-----END CERTIFICATE-----');
          done();
         }
      });
    });

    it('should return the appropriate "issuer" object', function(done) {
      opensslTools.getCertificateInfo(testCertificate, function(err, data){
        if (err) {
          console.error(err);
        } else {
          expect(data.issuer).to.deep.equal({
            C: 'GB',
            ST: 'Greater Manchester',
            L: 'Salford',
            O: 'COMODO CA Limited',
            CN: 'COMODO ECC Domain Validation Secure Server CA 2'
          });
          done();
         }
      });
    });

    it('should return the appropriate "subject" object', function(done) {
      opensslTools.getCertificateInfo(testCertificate, function(err, data){
        if (err) {
          console.error(err);
        } else {
          expect(data.subject).to.deep.equal({
            OU: 'PositiveSSL Multi-Domain',
            CN: 'sni33280.cloudflaressl.com'
          });
          done();
         }
      });
    });
  });

  describe('getCertificateRequestInfo', function() {
    it('should return the appropriate "certificate" object', function(done) {
      opensslTools.getCertificateRequestInfo(testCertificateRequest, function(err, data){
        if (err) {
          console.error(err);
        } else {
          expect(data.certificate).to.deep.equal('-----BEGIN CERTIFICATE REQUEST-----\nMIIC+jCCAeICAQAwgbQxCzAJBgNVBAYTAkRFMRAwDgYDVQQIDAdCYXZhcmlhMRMw\nEQYDVQQHDApFaWJlbHN0YWR0MSUwIwYDVQQKDBxZRUFIV0hBVD8hIE1pbmVjcmFm\ndCBzZXJ2ZXJzMRQwEgYDVQQLDAtNYWlsIHN5c3RlbTEcMBoGA1UEAwwTY2hld2Jh\nY2NhLnllYWh3aC5hdDEjMCEGCSqGSIb3DQEJARYUcG9zdG1hc3RlckB5ZWFod2gu\nYXQwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDAi9mSsi01EDc3QMCL\nlreBVzDSsICIc8w4mttgSg+cW/Hl98iDZ/awyv0hEeXLg/rybR42LHCRXyJbiuV8\nedOGbYN5ODD3di5tOmzjgJm34gmSxuzzZSe6431C9nR0BJaPwGbBoFqBO5MiWD1i\nZ7Cv3a+xJQO0gN+3PIgSMOGAD608bqJN58ewtqqYY0xM3vQCEcf40TJJc8fv1+a5\n1BM07s26L0Az5xZeIcWOqBgvBQhY0dI3QEKW5BbQDVA/OFilpbJFqCseosjz0/YG\ntS46CHGjNuViAcxeJ/IWKRWB3TCd2KhIqaEZLCVTWPqCaQ7CioITgrQW+c/qVCfv\nto6xAgMBAAGgADANBgkqhkiG9w0BAQsFAAOCAQEAu8gxx8RrQPeWvKJiY3fmTNHg\nlEDQU2vTPU+56UZEuCVztj1LdmjzFpH6biFa+C2XxkTxfeXc9OakklWlIgfP7b2Y\nRTObWPcpyDSE+yB79Lhybb4Wr3vASJJWSgwqymp5BjEj0iHeVFzvippvvyPieafr\na31cPiG5UbOWOXpeZ73K1qBqmpRglzYouqWPA0D9e9wks71INhPL8wODRha2RZ9M\nvoaVZHsm6NB+WAZzK+wznc1wLs/mVigqfjakU//VXi8opb7hTkH1/8h8Pn5uCFM7\n3UcTESfcIv3XuKeLXKQEJZtR3PQlWDb+pI7x1iUm7k0Q1KXsYysdUzq/fGTSdw==\n-----END CERTIFICATE REQUEST-----');
          done();
         }
      });
    });

    it('should return the appropriate "subject" object', function(done) {
      opensslTools.getCertificateRequestInfo(testCertificateRequest, function(err, data){
        if (err) {
          console.error(err);
        } else {
          expect(data.subject).to.deep.equal({
            C: 'DE',
            ST: 'Bavaria',
            L: 'Eibelstadt',
            O: 'YEAHWHAT?! Minecraft servers',
            OU: 'Mail system',
            CN: 'chewbacca.yeahwh.at',
            emailAddress: 'postmaster@yeahwh.at'
          });
          done();
         }
      });
    });
  });

});
