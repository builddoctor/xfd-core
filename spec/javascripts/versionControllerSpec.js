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
describe('Version Controller', function () {
  describe('parseVersionString', function () {
    var version = new VersionController();

    it('should parse into major, minor, patch', function () {
      var expected = {major: 1, minor: 1, patch: 1};
      expect(version.parseVersionString("1.1.1")).toEqual(expected);
    });

    it('should make bad values zeros', function () {
      var expected = {major: 1, minor: 0, patch: 4};
      expect(version.parseVersionString("1.a4fad6.4")).toEqual(expected);
    });
  });

  describe('checkVersionDifference', function () {
    var version = new VersionController();

    it('should be able to check that a value is greater than', function () {
      expect(version.checkVersionDifference("0.2.7", "0.2.8")).toEqual(true);
      expect(version.checkVersionDifference("0.2.8", "0.2.9")).toEqual(true);
      expect(version.checkVersionDifference("0.2.9", "0.2.10")).toEqual(true);
      expect(version.checkVersionDifference("0-2-6.3494", "0.2.11")).toEqual(true);
      expect(version.checkVersionDifference("0.2.11", "0.7.86")).toEqual(true);
    });

    it('should be able to check a value is less than', function () {
      expect(version.checkVersionDifference("0.2.8", "0.2.7")).toEqual(false);
      expect(version.checkVersionDifference("0.2.12", "0.2.5")).toEqual(false);
    });
  });

  describe('checkVersionResults', function () {
    var container, input, version;

    beforeEach(function () {
      version = new VersionController();
      $("<div id=\"flash-container\"></div>").appendTo("body");
      container = $("#flash-container");
      $("<input class=\"app-version\" id=\"app-version\" type=\"hidden\" value=\"0.0.0\"/>").appendTo("body");
      input = $("input#app-version");
    });

    afterEach(function () {
      version = undefined;
      input.remove();
      input = undefined;
      container.remove();
      container = undefined;
    });

    function updateVersion(version) {
      input.val(version)
    }

    it('should return false if no input provided', function () {
      expect(version.checkVersionResults()).toEqual(false);
    });

    it('should show nothing if versions are the same', function () {
      var data = {version: "0.2.7"};
      updateVersion(data.version);

      expect(version.checkVersionResults(data)).toEqual(true);
      expect(container.html()).toEqual("");
    });

    it('should show warning if new version available', function () {
      var data = {version: "0.2.11"};
      updateVersion("0.2.7");

      expect(version.checkVersionResults(data)).toEqual(true);
      expect(container.html()).toEqual("A newer version is available: refresh this page to fetch it");
    });
  });
});
