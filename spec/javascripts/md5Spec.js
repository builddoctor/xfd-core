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
describe('MD5', function () {
  it('produces the correct hash for different input values', function () {
    expect(MD5("")).toEqual("d41d8cd98f00b204e9800998ecf8427e");
    expect(MD5("test")).toEqual("098f6bcd4621d373cade4e832627b4f6");
    expect(MD5("joe")).toEqual("8ff32489f92f33416694be8fdc2d4c22");
    expect(MD5("test@me.com")).toEqual("8867aebd24d5d4809c3ab6fe4a0771e7");
    expect(MD5("kushi.p@gmail.com")).toEqual("47cc696e78f18a43162501c40b0a3fc8");
    expect(MD5("simpsonjulian@gmail.com")).toEqual("2a81e66a0e13ae077e9d32d646705e5c");
  });
});
