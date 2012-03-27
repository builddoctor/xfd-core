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
describe('build monitor', function () {
  var buildMonitorController;

  beforeEach(function () {
    var baseDir;
    if (window.location.protocol.match(/file:/)) {
      baseDir = window.location.pathname.replace('SpecRunner.html',
                                                 '');
    } else { 
      baseDir = '';
    }
    var assetDir = baseDir + 'spec/assets/fixtures';
    loadFixtures(assetDir + '/status-bar-initial.html',
                 assetDir + '/builds.html');
    buildMonitorController = new BuildMonitorController();
  });

  it('should have 5 green divs and 5 red divs if 1 build is green and 1 red', function () {
    BuildMonitor.totalCount = 2;
    BuildMonitor.successCount = 1;
    BuildMonitor.failCount = 1;

    var quantised = BuildMonitor.quantise();
    $("#status-bar").replaceWith(buildMonitorController.renderStatusBar());
    expect(quantised.green).toEqual(5);
    expect(quantised.red).toEqual(5);
    expect(quantised.grey).toEqual(0);
  });

  it('should have 1 green divs and 9 red divs if 1 build is green and 9 are red', function () {
    BuildMonitor.totalCount = 10;
    BuildMonitor.successCount = 1;
    BuildMonitor.failCount = 9;

    var quantised = BuildMonitor.quantise();
    $("#status-bar").replaceWith(buildMonitorController.renderStatusBar());
    expect(quantised.green).toEqual(1);
    expect(quantised.red).toEqual(9);
    expect(quantised.grey).toEqual(0);
  });

  it('should have 2 green divs and 8 red divs if 2 builds are green and 9 are red', function () {
    BuildMonitor.totalCount = 11;
    BuildMonitor.successCount = 2;
    BuildMonitor.failCount = 9;

    var quantised = BuildMonitor.quantise();
    $("#status-bar").replaceWith(buildMonitorController.renderStatusBar());
    expect(quantised.green).toEqual(2);
    expect(quantised.red).toEqual(8);
    expect(quantised.grey).toEqual(0);
  });

  it('should have 2 green divs and 8 red divs if 3 builds are green and 10 are red', function () {
    BuildMonitor.totalCount = 13;
    BuildMonitor.successCount = 3;
    BuildMonitor.failCount = 10;

    var quantised = BuildMonitor.quantise();
    $("#status-bar").replaceWith(buildMonitorController.renderStatusBar());
    expect(quantised.green).toEqual(2);
    expect(quantised.red).toEqual(8);
    expect(quantised.grey).toEqual(0);
  });

  it('should have 2 green divs and 8 red divs if 3 builds are green and 9 are red', function () {
    BuildMonitor.totalCount = 12;
    BuildMonitor.successCount = 3;
    BuildMonitor.failCount = 9;

    var quantised = BuildMonitor.quantise();
    $("#status-bar").replaceWith(buildMonitorController.renderStatusBar());
    expect(quantised.green).toEqual(2);
    expect(quantised.red).toEqual(8);
    expect(quantised.grey).toEqual(0);
  });

  it('should have 1 green divs and 9 red divs if 1 build is green and 10 are red', function () {
    BuildMonitor.totalCount = 11;
    BuildMonitor.successCount = 1;
    BuildMonitor.failCount = 10;

    var quantised = BuildMonitor.quantise();
    $("#status-bar").replaceWith(buildMonitorController.renderStatusBar());
    expect(quantised.green).toEqual(1);
    expect(quantised.red).toEqual(9);
    expect(quantised.grey).toEqual(0);
  });
});
