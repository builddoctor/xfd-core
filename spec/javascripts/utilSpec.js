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
describe('Utility Methods', function () {
  describe('String', function () {
    describe('endsWith', function () {
      it('should return true for the positive tests', function () {
        expect("red_anime".endsWith("_anime")).toEqual(true);
        expect("blue_anime".endsWith("_anime")).toEqual(true);
      });

      it('should return false for the negative tests', function () {
        expect("red_anime".endsWith("red")).toEqual(false);
        expect("blue_anime".endsWith("blue")).toEqual(false);
      });
    });

    describe('trim', function () {
      it('should return an empty string, given an empty string', function () {
        expect("".trim()).toEqual("");
      });

      it('should remove beginning whitespace', function () {
        expect("   test".trim()).toEqual("test");
      });

      it('should remove ending whitespace', function () {
        expect("test    ".trim()).toEqual("test");
      });

      it('should remove beginning/ending whitespace', function () {
        expect("   test   ".trim()).toEqual("test");
      });
    });
  });

  describe('timeSince', function () {
    var util = new Util();

    it('should provide the string immediate times', function () {
      var date = new Date();
      expect(util.timeSince(date)).toEqual("just now");
    });

    it('should provide the string second times', function () {
      var date = new Date() - 50000;
      expect(util.timeSince(date)).toEqual("50 seconds ago");

      var date2 = new Date() - 30000;
      expect(util.timeSince(date2)).toEqual("30 seconds ago");
    });

    it('should provide the string minute times', function () {
      var date = new Date() - 70000;
      expect(util.timeSince(date)).toEqual("a minute ago");

      var date2 = new Date() - 120000;
      expect(util.timeSince(date2)).toEqual("2 minutes ago");
    });

    it('should provide the string hour times', function () {
      var date = new Date() - 5000000;
      expect(util.timeSince(date)).toEqual("1 hour ago");

      var date2 = new Date() - 30000000;
      expect(util.timeSince(date2)).toEqual("8 hours ago");
    });

    it('should provide the string day times', function () {
      var date = new Date() - 90000000;
      expect(util.timeSince(date)).toEqual("yesterday");

      var date = new Date() - 900000000;
      expect(util.timeSince(date)).toEqual("over a day ago");
    });
  });

  describe('gravatarHash', function () {
    var util = new Util();

    it('should return the correct hash given an empty string', function () {
      expect(util.gravatarHash("")).toEqual("d41d8cd98f00b204e9800998ecf8427e");
    });

    it('should trim the string correctly to return the correct hash', function () {
      expect(util.gravatarHash(" test@me.com ")).toEqual(MD5("test@me.com"));
    });

    it('should lowercase the email and return the correct hash', function () {
      expect(util.gravatarHash("TestING@me.com")).toEqual(MD5("testing@me.com"));
    });

    it('should trim and lowercase the email and return the correct hash', function () {
      expect(util.gravatarHash("  TESTing@Me.com ")).toEqual(MD5("testing@me.com"));
    });
  });

  describe('memoize', function () {
    var util = new Util();

    var memo = {};
    var fib = function(n) {
      return n < 2 ? n : fib(n - 1) + fib(n - 2);
    };
    var fastFib = util.memoize(fib, memo);

    var size = function(obj) {
      var size = 0, key;
      for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
      }
      return size;
    };

    it('a memoized version of fibonacci produces identical results', function () {
      expect(fib(10)).toEqual(55);
      expect(fastFib(10)).toEqual(55);
    });

    it('should a memoized hash not be present, call down to the function', function () {
      expect(size(memo)).toEqual(1);
      expect(fastFib(15)).toEqual(610);
      expect(size(memo)).toEqual(2);
});

    it('should be easy to invalidate the cache when we need to do', function () {
      var cache = {};

      var localFib = util.memoize(fib, cache);

      expect(size(cache)).toEqual(0);
      expect(localFib(15)).toEqual(610);
      expect(size(cache)).toEqual(1);

      cache = {};
      expect(size(cache)).toEqual(0);
    });
  });
});
