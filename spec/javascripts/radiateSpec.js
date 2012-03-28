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
describe('CONFIG', function () {
  beforeEach(function () {
    delete config.username;
    delete config.password;

    config = CONFIG;
    config.engine = null;
    config.init();
  });

  it('should have a default engine of Hudson', function() {
    expect(config.engine).toEqual(Hudson);
  });

  it('should select CruiseControl given the param cruisecontrol', function() { 
    spyOn(config, 'lookupParam').andReturn("cruisecontrol");
    config.init();
    var engine = config.engine;
    expect(engine.name).toEqual('cruisecontrol');
    expect(engine.defaultUri).toEqual('/cruisecontrol');
    expect(engine.defaultHost).toEqual('localhost');
    expect(engine.defaultPort).toEqual(8080);
    expect(config.lookupParam).toHaveBeenCalled();
  });

  it('should select TeamCity given the param teamcity', function() { 
    spyOn(config, 'lookupParam').andReturn("teamcity");
    config.init();
    var engine = config.engine;
    expect(engine.name).toEqual('teamcity');
    expect(engine.defaultUri).toEqual('/');
    expect(engine.defaultHost).toEqual('localhost');
    expect(engine.defaultPort).toEqual(8111)
    expect(config.lookupParam).toHaveBeenCalled();
  });

  it('should select Hudson given the param hudson', function() { 
    expect(CONFIG.selectEngine('hudson').name).toEqual('hudson');
    expect(CONFIG.selectEngine('hudson').defaultUri).toEqual('/hudson');
    expect(CONFIG.selectEngine('hudson').defaultHost).toEqual('localhost');
    expect(CONFIG.selectEngine('hudson').defaultPort).toEqual("8888");
  });

  /*
    it('should select Hudson given no param', function() { 
    spyOn(config, 'lookupParam').andReturn("undefined");
    config.init();
    var engine = config.engine;
    expect(engine.name).toEqual('hudson');
    var url = engine.url(config);
    expect(url).toEqual('http://xfd.build-doctor.com:80/hudson/api/json?jsonp=?');
    });
  */

  it('should render a cruisecontrol url when engine explicitly set', function() { 
    config.engine = CruiseControl;
    config.init();
    var engine = config.engine;
    expect(engine).toEqual(CruiseControl);
    expect(engine.defaultUri).toEqual('/cruisecontrol');
  });


  it('should put higher precendence on Form inputs than URL inputs', function () {
    var localhost = 'localhost';
    var cijenkins = 'ci-jenkings.org';

    spyOn(config, 'lookupUrlParam').andReturn(localhost);
    spyOn(config, 'lookupFormParam').andReturn(cijenkins);

    // Test that our mocked methods return values as expected.
    expect(config.lookupUrlParam('host')).toEqual(localhost);
    expect(config.lookupFormParam('host')).toEqual(cijenkins);

    // Now make sure that Form entries are given higher precedence
    // over URL params.
    expect(config.lookupParam('host')).toEqual(cijenkins);
  });
});


