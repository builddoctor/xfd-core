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
describe('hudson model', function () {

  var build = $.parseJSON('{"building":true,"description":null,"duration":50000,"fullDisplayName":"Cucumber JVM #54","id":"2011-11-15_05-27-45","keepLog":false,"number":54,"result":"SUCCESS","timestamp":1321352865381,"url":"http://178.79.177.118/job/Cucumber%20JVM/54/","builtOn":"","culprits":[],"mavenArtifacts":{},"mavenVersionUsed":"3.0.3"}');
  var job = $.parseJSON('{"displayName":"Cucumber JVM","name":"Cucumber JVM","url":"http://178.79.177.118/job/Cucumber%20JVM/","builds":[{"number":58,"url":"http://178.79.177.118/job/Cucumber%20JVM/58/"},{"number":57,"url":"http://178.79.177.118/job/Cucumber%20JVM/57/"}],"lastBuild":{"number":58,"url":"http://178.79.177.118/job/Cucumber%20JVM/58/"}}');
  var response = $.parseJSON("{ \"timestamp\": 1321352865381, \"difference\": 4000 }");

  it('should produce the timestamp', function () {
    spyOn(Hudson, 'getData').andReturn(build);

    var data = Hudson.parseJob("this has been mocked");

    expect(data.timestamp).toEqual(1321352865381);
  });

  it('produces the time between the start point and the end point', function () {
    spyOn(Hudson, 'getData').andReturn(build);

    var data = Hudson.parseJob("this has been mocked");
    var now = Date.now() - 1321352865381;

    expect(data.difference).toEqual(now);
  });

  it('should extract the json from a given job\'s build url', function () {
    spyOn(Hudson, 'getData').andReturn(build);

    expect(Hudson.getLastDuration("this has been mocked")).toEqual(50000);
  });

  it('should guess at the percentage completed', function () {
    spyOn(Hudson, 'parseJob').andReturn(response);
    spyOn(Hudson, 'getLastDuration').andReturn(50000);
    spyOn(Hudson, 'getData').andReturn(job);

    expect(Hudson.getProgress("this has been mocked")).toEqual(0.08);
  });

  it('should be able to parse the colour correctly', function () {
    // Disabled builds.
    expect(Hudson.getState('grey')).toEqual('grey');
    expect(Hudson.getState('gray')).toEqual('grey');
    expect(Hudson.getState('disabled')).toEqual('grey');
    expect(Hudson.getState('bloop')).toEqual('grey');

    // Green builds.
    expect(Hudson.getState('blue')).toEqual('green');
    expect(Hudson.getState('green')).toEqual('green');

    // Red builds.
    expect(Hudson.getState('red')).toEqual('red');

    // Building.
    expect(Hudson.getState('blue_anime')).toEqual('building');
    expect(Hudson.getState('red_anime')).toEqual('building');
  });
});
