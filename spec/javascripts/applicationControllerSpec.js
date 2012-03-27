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
describe('Application Controller', function () {
  describe('renderFlash', function () {
    // Build out elements/objects we're going to use.
    var app, container;

    beforeEach(function () {
      app = new ApplicationController();
      $("<div id=\"flash-container\"></div>").appendTo("body");
      container = $("#flash-container");
    });

    afterEach(function () {
      app = undefined;
      container.remove();
      container = undefined;
    });

    it('should have elements present for test', function () {
      expect($("body").length).toEqual(1);
      expect($("#flash-container").length).toEqual(1);
    });

    it('should be able to produce an object on instantiation', function () {
      expect(app).toEqual(new ApplicationController());
    });

    it('should produce true when renderFlash completes', function () {
      expect(app.renderFlash("notice", "notice this text")).toEqual(true);
    });

    it('should produce false when given bad input', function () {
      expect(app.renderFlash()).toEqual(false);
      expect(app.renderFlash("", "")).toEqual(false);
      expect(app.renderFlash(undefined, undefined)).toEqual(false);
      expect(app.renderFlash("bloop", "dummy text")).toEqual(false);
    });

    it('should have notice items in place', function () {
      app.renderFlash("notice", "notice this text");
      expect($("#flash-container").hasClass("notice")).toEqual(true);
      expect(container.html()).toEqual("notice this text");
    });

    it('should have warning items in place', function () {
      app.renderFlash("warning", "warning this text");
      expect($("#flash-container").hasClass("warning")).toEqual(true);
      expect(container.html()).toEqual("warning this text");
    });

    it('should have error items in place', function () {
      app.renderFlash("error", "error this text");
      expect($("#flash-container").hasClass("error")).toEqual(true);
      expect(container.html()).toEqual("error this text");
    });
  });

  describe('clearLocalStorage', function () {
    var app;

    beforeEach(function () {
      app = new ApplicationController();
    });

    function getLocalStorageSize () {
      var count = 0;
      for (var key in window.localStorage) {
        count++;
      }

      return count;
    }

    it('leaves the items matching our prefix alone', function () {
      var prefix = CONFIG.localStoragePrefix;

      window.localStorage.setItem(prefix + "a", "a");
      window.localStorage.setItem(prefix + "b", "b");

      var sizeBefore = getLocalStorageSize();

      app.clearLocalStorage();

      var sizeAfter = getLocalStorageSize();

      expect(sizeBefore).toEqual(sizeAfter);
    });

    it('clears items that do no match the prefix', function () {
      window.localStorage.setItem("a", "a");
      window.localStorage.setItem("b", "b");

      var sizeBefore = getLocalStorageSize();

      app.clearLocalStorage();

      var sizeAfter = getLocalStorageSize();

      expect(sizeBefore).toEqual(sizeAfter + 2);
    });

  });
});
