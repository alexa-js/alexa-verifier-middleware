# openssl-cert-tools

[![Current tag](http://img.shields.io/github/tag/frdmn/openssl-cert-tools.svg)](https://github.com/frdmn/openssl-cert-tools/tags) [![Repository issues](http://issuestats.com/github/frdmn/openssl-cert-tools/badge/issue)](http://issuestats.com/github/frdmn/openssl-cert-tools) [![Build Status](https://travis-ci.org/frdmn/openssl-cert-tools.svg?branch=master)](https://travis-ci.org/frdmn/openssl-cert-tools)

NodeJS module to handle TLS certificates using OpenSSL.

## Installation

```shell
cd your-project/
npm install openssl-cert-tools
```

## Usage

```javascript
var opensslTools = require('openssl-cert-tools');

var demoCertificate =
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
'dC5wYXJ0eYILZWxrYXNzYS5jb22CBmZyZC5tboIZZy1hbmQtYy1lbGVjdHJvbmljv\n' +
'cy5jby51a4IHZ2hhYy5kZYIMa25vdHRib3lzLmV1ghhtb250Z29tZXJ5dm9jYWxj\n' +
'b2FjaC5jb22CDG1vemFpay5jby5pZIIJbW96YWlrLmlkgghuZXdlci5jY4IUcGVy\n' +
'c29uYWxpemFyYmxvZy5jb22CEnN3YWdkb2d3YWxraW5nLmNvbYIXdGhlZ29sZGVu\n' +
'YW5kY29tcGFueS5jb20wCgYIKoZIzj0EAwIDRwAwRAIgZzfbzLiht8LIcEwvCKIj\n' +
'xRC5hF3mcVUzAYMTsAp+PWoCIBCaOZvgDR0t7tCijM6o5N3vNHDs0vQbtQkEaQSx\n' +
'/j9A\n' +
'-----END CERTIFICATE-----\n';

opensslTools.getCertificateInfo(demoCertificate, function(err, data){
  if (err) {
    console.log(err)
  } else {
    console.log(data);
    /* =>
     * {
     *   certificate: '-----BEGIN CERTIFICATE-----[...]',
     *   issuer: {
     *     C: 'US',
     *     ST: 'State',
     *     L: 'Location',
     *     O: 'Organization',
     *     CN: 'Common Name'
     *   },
     *   subject: {
     *     OU: 'ProductNameSSL',
     *     CN: 'common.name.com'
     *   },
     *   validFrom: Sat Sep 26 2015 02: 00: 00 GMT + 0200(CEST),
     *   validTo: Thu Dec 31 2015 00: 59: 59 GMT + 0100(CET),
     *   remainingDays: 96
     * }
     */
  }
});

var demoCertificateRequest =
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
'-----END CERTIFICATE REQUEST-----\n';

opensslTools.getCertificateRequestInfo(demoCertificate, function(err, data){
  if (err) {
    console.log(err)
  } else {
    console.log(data);
    /* =>
     * {
     *   certificate: '-----BEGIN NEW CERTIFICATE REQUEST-----[...]',
     *   subject: {
     *     C: 'DE',
     *     ST: 'State',
     *     L: 'Location',
     *     O: 'Organization',
     *     OU: 'Organization Unit',
     *     CN: 'common.name.com'
     *   }
     * }
     */
  }
});

test.getCertificate('frd.mn', '443', function(err, crt){
  if (!err) {
    console.log(crt);
    /* =>
     * -----BEGIN CERTIFICATE-----
     * MIIGGTCCBcCgAwIBAgIQMqz1AmaFXNCYqtqJu8OU2jAKBggqhkjOPQQDAjCBkjEL
     * MAkGA1UEBhMCR0IxGzAZBgNVBAgTEkdyZWF0ZXIgTWFuY2hlc3RlcjEQMA4GA1UE
     * BxMHU2FsZm9yZDEaMBgGA1UEChMRQ09NT0RPIENBIExpbWl0ZWQxODA2BgNVBAMT
     * L0NPTU9ETyBFQ0MgRG9tYWluIFZhbGlkYXRpb24gU2VjdXJlIFNlcnZlciBDQSAy
     * MB4XDTE1MTExMzAwMDAwMFoXDTE2MDUwNzIzNTk1OVowazEhMB8GA1UECxMYRG9t
     * YWluIENvbnRyb2wgVmFsaWRhdGVkMSEwHwYDVQQLExhQb3NpdGl2ZVNTTCBNdWx0
     * aS1Eb21haW4xIzAhBgNVBAMTGnNuaTMzMjgwLmNsb3VkZmxhcmVzc2wuY29tMFkw
     * EwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE/VVyjyzoogarRb9sqmpqwwAf+Kh69I9E
     * 5NeT/1s9nVjvEzYTnrEN3xqNrzbA/y61AbJ6Yy714OCq1ViAmBuCPaOCBBwwggQY
     * MB8GA1UdIwQYMBaAFEAJYWfwvINxT94SCCxv1NQrdj2WMB0GA1UdDgQWBBT1uV7H
     * fwV8Ca9MxjAiSHOEyE9EVDAOBgNVHQ8BAf8EBAMCB4AwDAYDVR0TAQH/BAIwADAd
     * BgNVHSUEFjAUBggrBgEFBQcDAQYIKwYBBQUHAwIwTwYDVR0gBEgwRjA6BgsrBgEE
     * AbIxAQICBzArMCkGCCsGAQUFBwIBFh1odHRwczovL3NlY3VyZS5jb21vZG8uY29t
     * L0NQUzAIBgZngQwBAgEwVgYDVR0fBE8wTTBLoEmgR4ZFaHR0cDovL2NybC5jb21v
     * ZG9jYTQuY29tL0NPTU9ET0VDQ0RvbWFpblZhbGlkYXRpb25TZWN1cmVTZXJ2ZXJD
     * QTIuY3JsMIGIBggrBgEFBQcBAQR8MHowUQYIKwYBBQUHMAKGRWh0dHA6Ly9jcnQu
     * Y29tb2RvY2E0LmNvbS9DT01PRE9FQ0NEb21haW5WYWxpZGF0aW9uU2VjdXJlU2Vy
     * dmVyQ0EyLmNydDAlBggrBgEFBQcwAYYZaHR0cDovL29jc3AuY29tb2RvY2E0LmNv
     * bTCCAmMGA1UdEQSCAlowggJWghpzbmkzMzI4MC5jbG91ZGZsYXJlc3NsLmNvbYIT
     * Ki4xMDAxY29ja3RhaWxzLmNvbYIRKi4xMDAxbW90ZXVycy5jb22CEiouYWxpZml0
     * emdlcmFsZC5tZYINKi5hbGlrZml0ei5tZYINKi5ib3J1dC5wYXJ0eYINKi5lbGth
     * c3NhLmNvbYIIKi5mcmQubW6CGyouZy1hbmQtYy1lbGVjdHJvbmljcy5jby51a4IJ
     * Ki5naGFjLmRlgg4qLmtub3R0Ym95cy5ldYIaKi5tb250Z29tZXJ5dm9jYWxjb2Fj
     * aC5jb22CDioubW96YWlrLmNvLmlkggsqLm1vemFpay5pZIIWKi5wZXJzb25hbGl6
     * YXJibG9nLmNvbYIUKi5zd2FnZG9nd2Fsa2luZy5jb22CGSoudGhlZ29sZGVuYW5k
     * Y29tcGFueS5jb22CETEwMDFjb2NrdGFpbHMuY29tgg8xMDAxbW90ZXVycy5jb22C
     * EGFsaWZpdHpnZXJhbGQubWWCC2FsaWtmaXR6Lm1lggtib3J1dC5wYXJ0eYILZWxr
     * YXNzYS5jb22CBmZyZC5tboIZZy1hbmQtYy1lbGVjdHJvbmljcy5jby51a4IHZ2hh
     * Yy5kZYIMa25vdHRib3lzLmV1ghhtb250Z29tZXJ5dm9jYWxjb2FjaC5jb22CDG1v
     * emFpay5jby5pZIIJbW96YWlrLmlkghRwZXJzb25hbGl6YXJibG9nLmNvbYISc3dh
     * Z2RvZ3dhbGtpbmcuY29tghd0aGVnb2xkZW5hbmRjb21wYW55LmNvbTAKBggqhkjO
     * PQQDAgNHADBEAiBTlTYFkE9plIJhPMbOC95KAnpOw2UrOLSzmL/laTanoQIgCSLp
     * 9AhIYFMZOdUkCVLEWFgCuDpd1p4MlvszlJBdcgQ=
     * -----END CERTIFICATE-----
     */
  }
});

```

## Contributing

1. Fork it
2. Create your feature branch: `git checkout -b feature/my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/my-new-feature`
5. Submit a pull request

## Requirements / Dependencies

* NodeJS

## Credits

* @[es128](https://github.com/es128/) for the [ssl-utils](https://github.com/es128/ssl-utils/) Node module:  
https://github.com/es128/ssl-utils/

## License

[MIT](LICENSE)
