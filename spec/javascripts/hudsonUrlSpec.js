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
describe('hudson', function () {
  beforeEach(function () {
    config = CONFIG;
    config.engine = null;
    config.init();
  });

  it('should have a default url that hits our hudson dummy', function() {
    expect(Hudson.url(config)).toEqual('http://localhost:/hudson/api/json?jsonp=?');
  });

  it('should have a url with a different context root if you tell it', function() {
    CONFIG.context="/harry";
    expect(Hudson.url(config)).toEqual('http://localhost:/harry/api/json?jsonp=?');
  });

  it('should cope with chrome passing a trailing hash on the context', function() { 
    CONFIG.context="/ci#";
    expect(Hudson.url(config)).toEqual('http://localhost:/ci/api/json?jsonp=?');
  });

  it('should cope with chrome passing escaped paths hash on the context', function() { 
    CONFIG.context="%2Fhudson";
    expect(Hudson.url(config)).toEqual('http://localhost:/hudson/api/json?jsonp=?');
  });

  it('should have a url with a different port root if you tell it', function() {
    CONFIG.port="8080";
    expect(Hudson.url(config)).toEqual('http://localhost:8080/hudson/api/json?jsonp=?');
  });

  it('should have a url with a different host if you tell it', function() {
    CONFIG.host="harry";
    CONFIG.context="/"
    expect(Hudson.url(config)).toEqual('http://harry:/api/json?jsonp=?');
  });

  it('should put the username and password in the url if you give it', function() {
    CONFIG.username="harpo";
    CONFIG.password="swordfish";
    expect(Hudson.url(config)).toEqual('http://harpo:swordfish@localhost:/hudson/api/json?jsonp=?');
  });

});
