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
describe('Project Controller', function () {
  describe('renderJob', function () {
    var project, container;

    beforeEach(function () {
      project = new ProjectController();
      $("<div id=\"container\"><ul id=\"projects\"></ul></div>").appendTo("body");
      container = $("div#container ul#projects");
    });

    afterEach(function () {
      var parent = container.parent();

      project = undefined;
      container.remove();
      parent.remove();
      container = undefined;
    });

    it('should have elements present for test', function () {
      expect($("body").length).toEqual(1);

      // This is what we're adding/removing for every test.
      expect($("div#container").length).toEqual(1);
      expect($("div#container ul#projects").length).toEqual(1);

      // Important to make sure there are no child elements present!
      expect($("div#container ul#projects").children().length).toEqual(0);
    });

    it('should return false on bad input', function () {
      expect(project.renderJob()).toEqual(false);
      expect(project.renderJob(undefined, undefined)).toEqual(false);
      expect(project.renderJob("", "")).toEqual(false);
    });

    it('should return false when the element doesn\'t exist', function () {
      // delete the element.
      container.parent().remove();

      spyOn(ApplicationController.prototype, 'renderJob').andReturn("<li>hello</li>");

      var job = {
        'color': 'red',
        'name': 'test job',
        'url': 'http://test.com/'
      };

      expect(project.renderJob("test", job)).toEqual(false);
      expect($("div#container ul#projects").children().length).toEqual(0);
      expect($("div#container ul#projects").html()).toEqual(null);
    });

    it('should render a job', function () {
      spyOn(ApplicationController.prototype, 'renderJob').andReturn("<li>hello</li>");

      var job = {
        'color': 'red',
        'name': 'test job',
        'url': 'http://test.com/'
      };

      expect(project.renderJob("test", job)).toEqual(true);
      expect($("div#container ul#projects").children().length).toEqual(1);
      expect($("div#container ul#projects").html()).toEqual("<li>hello</li>");
    });
  });

  describe('selectAndRenderJobs', function () {
    var project, container, jobs;

    function createJob(colour) {
      return {
        'color': colour,
        'name': 'test job',
        'url': 'http://test.com/'
      };
    }

    jobs = {
      "1": createJob("red"),
      "2": createJob("green"),
      "3": createJob("grey")
    };

    beforeEach(function () {
      project = new ProjectController();
      $("<div id=\"container\"><ul id=\"projects\"></ul></div>").appendTo("body");
      container = $("div#container ul#projects");
    });

    afterEach(function () {
      var parent = container.parent();

      project = undefined;
      container.remove();
      parent.remove();
      container = undefined;
    });

    it('should have all of the fixtures in place', function () {
      expect(jobs["1"].color).toEqual("red");
      expect(jobs["2"].color).toEqual("green");
      expect(jobs["3"].color).toEqual("grey");
    });

    it('should have elements present for test', function () {
      expect($("body").length).toEqual(1);

      // This is what we're adding/removing for every test.
      expect($("div#container").length).toEqual(1);
      expect($("div#container ul#projects").length).toEqual(1);

      // Important to make sure there are no child elements present!
      expect($("div#container ul#projects").children().length).toEqual(0);
    });

    it('should return false on bad input', function () {
      expect(project.selectAndRenderJobs()).toEqual(false);
      expect(project.selectAndRenderJobs(undefined, undefined)).toEqual(false);
      expect(project.selectAndRenderJobs("", "")).toEqual(false);
    });

    it('render the specific jobs', function () {
      spyOn(ApplicationController.prototype, 'renderJob').andReturn("<li>A Job</li>");

      expect(project.selectAndRenderJobs(jobs, "red")).toEqual(true);
      expect(container.children().length).toEqual(1);

      expect(project.selectAndRenderJobs(jobs, "green")).toEqual(true);
      expect(container.children().length).toEqual(2);

      expect(project.selectAndRenderJobs(jobs, "grey")).toEqual(true);
      expect(container.children().length).toEqual(3);
    });
  });

  describe('filterProjects', function () {
    var projectList, container, projects, jobs;

    beforeEach(function () {
      $("<ul id=\"projects\"><li id=\"project-stats\"></li></ul>").appendTo('body');
      $("<div id=\"container\"><ul id=\"projects\"></ul></div>").appendTo("body");

      projectList = $("ul#projects");
      container = $("div#container ul#projects");

      project = new ProjectController();

      // Need some test project data.
      $("<li>Red</li><li>Green</li><li>Grey</li>").appendTo(container);
    });

    afterEach(function () {
      projectList.remove();
      container.remove();
    });

    it('should filter the list to empty', function () {
      // Need to get the input here as it's added by ProjectController.
      var input = $("li#filter").find("input");

      expect(container.children().filter(":hidden").size()).toEqual(0);
      expect(container.children().length).toEqual(3);

      input.val("bleh");
      input.keyup();

      expect(container.children().filter(":hidden").size()).toEqual(3);
      expect(container.children().length).toEqual(3);
    });

    it('should filter the list when provided good input', function () {
      // Need to get the input here as it's added by ProjectController.
      var input = $("li#filter").find("input");

      expect(container.children().filter(":hidden").size()).toEqual(0);
      expect(container.children().length).toEqual(3);

      input.val("red");
      input.keyup();

      expect(container.children().filter(":hidden").size()).toEqual(2);
      expect(container.children().length).toEqual(3);
    });

    it('should filter the list when filter meets multiple jobs', function () {
      // Need to get the input here as it's added by ProjectController.
      var input = $("li#filter").find("input");

      expect(container.children().filter(":hidden").size()).toEqual(0);
      expect(container.children().length).toEqual(3);

      input.val("gr");
      input.keyup();

      expect(container.children().filter(":hidden").size()).toEqual(1);
      expect(container.children().length).toEqual(3);
    });
  });
});
