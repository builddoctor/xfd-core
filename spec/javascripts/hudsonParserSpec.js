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
describe('hudson parser', function () {
  var json = '{ "jobs": [ { "name": "groucho", "color": "red" }, { "name": "chico", "color": "blue" }, { "name": "harpo", "color": "grey" }, { "name": "zeppo", "color": "blue_anime", "url": "http://bleh.com/job/zeppo/" } ] }';
  var args = $.parseJSON(json);

  it('should return passed if a build passes', function() {
    spyOn(Hudson, 'getProgress').andReturn(0);
    var data  = Hudson.parse(args);

    expect(data.jobs[1].name).toEqual('chico');
    expect(data.jobs[1].color).toEqual('green');
  });

  it('should return f a i l e d if a build f a i l s', function() {
    spyOn(Hudson, 'getProgress').andReturn(0);
    var data  = Hudson.parse(args);

    expect(data.jobs[0].name).toEqual('groucho');
    expect(data.jobs[0].color).toEqual('red');
  });

  it('should return unknown if its not clear what state is', function() {
    spyOn(Hudson, 'getProgress').andReturn(0);
    var data  = Hudson.parse(args);

    expect(data.jobs[2].name).toEqual('harpo');
    expect(data.jobs[2].color).toEqual('grey');
    expect(data.jobs[3].name).toEqual('zeppo');
    expect(data.jobs[3].color).toEqual('building');
  });

  it('should be able to pull out the job url', function () {
    spyOn(Hudson, 'getProgress').andReturn(0);
    var data  = Hudson.parse(args);

    expect(data.jobs[3].color).toEqual('building');
    expect(data.jobs[3].url).toEqual('http://bleh.com/job/zeppo/');
  });
});
