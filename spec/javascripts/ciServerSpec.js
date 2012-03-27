/**
 * eXtreme Feedback Device (XFD) is a Build Radiator for Continuous
 * Integration servers. Copyright (C) 2010-2012 The Build Doctor Limited.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
describe('CI Server', function () {

  describe('sanitiseContextRoot', function () {
    it('should be able to sanitise slash to nothing', function () {
      expect(CiServer.sanitiseContextRoot("")).toEqual("");
    });

    it('should be able to sanitise slash to nothing', function () {
      expect(CiServer.sanitiseContextRoot("/")).toEqual("");
    });

    it('should be able to sanitise hash to nothing', function () {
      expect(CiServer.sanitiseContextRoot("/#test")).toEqual("/test");
    });

    it('should be able to sanitise /hudson to /hudson', function () {
      expect(CiServer.sanitiseContextRoot("/hudson")).toEqual("/hudson");
    });

    it('should be able to sanitise double slash to a slash', function () {
      expect(CiServer.sanitiseContextRoot("//hudson//api")).toEqual("/hudson/api");
    });
  });

  describe('addHttp', function () {
    it('should leave URLs with HTTP in them alone', function () {
      expect(CiServer.addHttp('http://localhost/test')).toEqual('http://localhost/test');
    });

    it('should leave URLs with HTTPS in them alone', function () {
      expect(CiServer.addHttp('https://localhost/test')).toEqual('https://localhost/test');
    });

    it('should update URLs with no HTTP prefix', function () {
      expect(CiServer.addHttp('localhost/test')).toEqual('http://localhost/test');
    });
  });

  describe('url', function () {
    it('should produce false if no inputs provided', function () {
      expect(CiServer.url("", "", "", "")).toEqual(false);
    });

    it('should produce false if no host provided', function () {
      expect(CiServer.url("", "80", "/hudson", "/api")).toEqual(false);
    });

    it('should produce the plain url if proper inputs provided', function () {
      expect(CiServer.url("xfd.com", "80", "/hudson", "/api")).toEqual("http://xfd.com:80/hudson/api");
    });

    it('should produce the plain url if only username provided', function () {
      expect(CiServer.url("xfd.com", "80", "/hudson", "/api", "top")).toEqual("http://xfd.com:80/hudson/api");
    });

    it('should produce the plain url if only password provided', function () {
      expect(CiServer.url("xfd.com", "80", "/hudson", "/api", undefined, "secret")).toEqual("http://xfd.com:80/hudson/api");
    });

    it('should produce the plain url if username/password empty', function () {
      expect(CiServer.url("xfd.com", "80", "/hudson", "/api", "", "")).toEqual("http://xfd.com:80/hudson/api");
    });

    it('should produce the http auth url if username/password provided', function () {
      expect(CiServer.url("xfd.com", "80", "/hudson", "/api", "top", "secret")).toEqual("http://top:secret@xfd.com:80/hudson/api");
    });

    it('should place the host prefix in the correct place', function () {
      expect(CiServer.url("http://xfd.com", "80", "/hudson", "/api", "top", "secret")).toEqual("http://top:secret@xfd.com:80/hudson/api");
      expect(CiServer.url("https://xfd.com", "80", "/hudson", "/api", "top", "secret")).toEqual("https://top:secret@xfd.com:80/hudson/api");
    });
  });
});
