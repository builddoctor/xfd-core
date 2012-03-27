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
describe('CruiseControl', function () {

  beforeEach(function () {
    radiate = {};
    radiate.host = 'localhost';
    radiate.port = '8080';
    radiate.context = '/cruisecontrol';
  });

  it('should have a default url that hits localhost', function() {
    expect(CruiseControl.url(radiate)).toEqual('http://localhost:8080/cruisecontrol/jsonp.jsp?jsonp=?');
  });

  it('should have a url with a different context root if you tell it', function() {
    radiate.context = '/harry'
    expect(CruiseControl.url(radiate)).toEqual('http://localhost:8080/harry/jsonp.jsp?jsonp=?');
  });

  it('should cope with chrome passing a trailing hash on the context', function() {
    radiate.context="/ci#";
    expect(CruiseControl.url(radiate)).toEqual('http://localhost:8080/ci/jsonp.jsp?jsonp=?');
  });

  it('should cope with chrome passing escaped paths hash on the context', function() {
    radiate.context="%2Fcruisecontrol";
    expect(CruiseControl.url(radiate)).toEqual('http://localhost:8080/cruisecontrol/jsonp.jsp?jsonp=?');
  });

  it('should have a url with a different port root if you tell it', function() {
    radiate.port="80";
    expect(CruiseControl.url(radiate)).toEqual('http://localhost:80/cruisecontrol/jsonp.jsp?jsonp=?');
  });

  it('should cope with no leading slash on the context', function() {
    radiate.context="cruisecontrol";
    expect(CruiseControl.url(radiate)).toEqual('http://localhost:8080/cruisecontrol/jsonp.jsp?jsonp=?');
  });

  it('should have a url with a different host if you tell it', function() {
    radiate.host="londev19.megacorp.internal";
    expect(CruiseControl.url(radiate)).toEqual('http://londev19.megacorp.internal:8080/cruisecontrol/jsonp.jsp?jsonp=?');
  });

  it('should cope with a flat context root', function() {
    radiate.context="/";
    expect(CruiseControl.url(radiate)).toEqual('http://localhost:8080/jsonp.jsp?jsonp=?');
  });
});
