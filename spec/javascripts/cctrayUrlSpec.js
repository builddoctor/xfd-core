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
describe('cctray', function () {
  var config;

  beforeEach(function () {
    config = CONFIG;
    config.engine = null;
    config.init();
  });

  it('should have a default url', function() {
    expect(CCTray.url(config)).toEqual('http://localhost:6969/localhost:/hudson?jsonp=?');
  });

  it('should have a url with a different context root if you tell it', function() {
    config.context="/harry";
    expect(CCTray.url(config)).toEqual('http://localhost:6969/localhost:/harry?jsonp=?');
  });

  it('should cope with chrome passing a trailing hash on the context', function() { 
    config.context="/ci#";
    expect(CCTray.url(config)).toEqual('http://localhost:6969/localhost:/ci?jsonp=?');
  });

  it('should cope with chrome passing escaped paths hash on the context', function() { 
    config.context="%2Fhudson";
    expect(CCTray.url(config)).toEqual('http://localhost:6969/localhost:/hudson?jsonp=?');
  });

  it('should have a url with a different port root if you tell it', function() {
    config.port="8080";
    expect(CCTray.url(config)).toEqual('http://localhost:6969/localhost:8080/hudson?jsonp=?');
  });

  it('should have a url with a different host if you tell it', function() {
    fakeLookup = function (param) { 
      if ("engine" === param) { return "cctray"; }
      else if ("host" === param) { return "mygreatserver"; } 
      else if ("context" === param) { return "/go/cctray.xml"; } 
      else if ("port" === param) { return 80; } 
    };
    spyOn(config, 'lookupParam').andCallFake(fakeLookup);
    config.init();
    expect(CCTray.url(config)).toEqual('http://localhost:6969/mygreatserver:80/go/cctray.xml?jsonp=?');
  });

});
