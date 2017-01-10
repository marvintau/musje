/* global musje, angular, MIDI */

(function (musje, angular, MIDI) {
  'use strict';

  var fonts = [
    { type: 'serif', name: 'Georgia, serif' },
    { type: 'serif',
      name: '"Palatino Linotype", "Book Antiqua", Palatino, serif' },
    { type: 'serif', name: '"Times New Roman", Times, serif' },
    { type: 'sans-serif', name: 'Arial, Helvetica, sans-serif' },
    { type: 'sans-serif', name: '"Arial Black", Gadget, sans-serif' },
    { type: 'sans-serif', name: '"Arial Narrow", sans-serif' },
    { type: 'sans-serif', name: '"Comic Sans MS", cursive, sans-serif' },
    { type: 'sans-serif', name: 'Century Gothic, sans-serif' },
    { type: 'sans-serif', name: 'Impact, Charcoal, sans-serif' },
    { type: 'sans-serif',
      name: '"Lucida Sans Unicode", "Lucida Grande", sans-serif' },
    { type: 'sans-serif', name: 'Tahoma, Geneva, sans-serif' },
    { type: 'sans-serif', name: '"Optima", Helvetica, sans-serif' },
    { type: 'sans-serif', name: 'Verdana, Geneva, sans-serif' },
    { type: 'sans-serif',
      name: 'Copperplate, "Copperplate Gothic Light", sans-serif' },
    { type: 'monospace', name: '"Courier New", Courier, monospace' },
    { type: 'monospace', name: '"Lucida Console", Monaco, monospace' }
  ];
  var samplePath = 'http://jianpu.github.io/musje-score-samples/';

  function now() { return new Date().getTime(); }

  var demo = angular.module('musjeDemo', ['ui.codemirror']);

  demo.controller('MusjeDemoCtrl', function ($scope, $http, $document) {
    $scope.playDisabled = true;
    $scope.pauseDisabled = true;
    // $scope.stopDisabled = true;

    $scope.fonts = fonts;
    $scope.selectedFont = $scope.fonts[11];


    $scope.loadSong = function () {
      $http.get(samplePath + $scope.selectedSong + '.txt').success(function (data) {
        $scope.src = data;
        $scope.run();
      });
    };

    $http.get(samplePath + 'song-list.txt').success(function (data) {
      $scope.songList = data.trim().split('\n');
      $scope.selectedSong = "客家本色"; // "望春風";
      $scope.loadSong();
    });

    // The ui-codemirror option
    $scope.cmOption = {
      mode: 'musje',
      theme: 'musje',
      lineNumbers: true,
      lineWrapping: true,
      indentWithTabs: true
    };

    $document.ready(function () {
      MIDI.loadPlugin({
        soundfontUrl: "./soundfont/",
        instrument: "acoustic_grand_piano", // or multiple instruments
        onsuccess: function () {
          $scope.playDisabled = false;
          $scope.$digest();
        }
      });
    });

    $scope.run = function () {
      var t0 = now();
      var score;
      try {
        score = musje.parse($scope.src);
      } catch (err) {
        $scope.totalMeasures = 'N/A';
        $scope.error = err.message;
      }
      if (score) {
        score = $scope.score = new musje.Score(score)
        $scope.parseTime = now() - t0;
        $document[0].title =  (score.head.title || 'Untitled') + ' - Musje';
        $scope.totalMeasures = score.measures.length;
        $scope.error = false;
        t0 = now();
        $scope.render();
        $scope.renderTime = now() - t0;
      }
    };

    $scope.render = function () {
      $scope.score.render('.mus-score', {
        fontFamily: $scope.selectedFont.name,
        fontWeight : "bold",
        width: $scope.width
      });
    };

    $scope.play = function () {
      $scope.score.play();
      // $scope.playDisabled = true;
      // $scope.stopDisabled = false;
    };

    $scope.stop = function () {
      $scope.score.stop();
    };

  });

  demo.directive('demoFooter', function () {
    return {
      restrict: 'A',
      templateUrl: 'demo-footer.html'
    };
  });

  demo.directive('resize', function ($window) {
    return {
      restrict: 'A',
      link: function postLink(scope, element) {
        function resized() {
          scope.width = element[0].offsetWidth;
        }
        resized();

        angular.element($window).bind('resize', function() {
          resized();
          scope.run();
          scope.$apply();
        });
      }
    };
  });

}(musje, angular, MIDI));
