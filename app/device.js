/* Public Tizen application APIs für Samsung NU7179 (DE/EU). No Mac server, network address or credentials. */
(function () {
  'use strict';
  var IDS = {
    // Streaming-Dienste (DE/EU)
    netflix: 'org.tizen.netflix-app',
    disneyplus: 'MCmYXNxgcu.DisneyPlus',
    youtube: '9Ur5IzDKqV.TizenYouTube',
    primevideo: 'org.tizen.primevideo',
    appletv: 'com.samsung.tv.aria-video',
    
    // Deutsche Sender & Dienste
    ard: 'org.tizen.ardmediathek',
    zdf: 'org.tizen.zdfmediathek',
    rtlplus: 'org.tizen.rtlplus',
    sat1: 'org.tizen.sat1',
    prosieben: 'org.tizen.prosieben',
    kabel1: 'org.tizen.kabel1',
    vox: 'org.tizen.vox',
    kabel1doku: 'org.tizen.kabel1doku',
    sixx: 'org.tizen.sixx',
    sport1: 'org.tizen.sport1',
    eurosport: 'org.tizen.eurosport',
    
    // Weitere Streaming-Dienste
    joyn: 'org.tizen.joyn',
    tvnow: 'org.tizen.tvnow',
    sky: 'org.tizen.sky',
    wowo: 'org.tizen.wowo',
    twitch: 'org.tizen.twitch',
    
    // Musik
    spotify: 'rJeHak5zRg.Spotify',
    deezer: 'org.tizen.deezer',
    amazonmusic: 'org.tizen.amazonmusic',
    
    // Samsung-eigene Apps
    browser: 'org.tizen.browser',
    gallery: 'com.samsung.tv.gallery',
    settings: 'com.samsung.tv.settings',
    
    // Legacy (falls noch vorhanden)
    stremio: 'IkWsFHtOY9.Stremio',
    abciview: 'mWK87Xghap.ABCiview',
    sbs: 'OyE7OuxlUi.SBSOnDemand',
    applemusic: 'org.tizen.apple.apple-music'
  };
  
  // Liste der Streaming-Apps für die "Alle Apps"-Ansicht
  var STREAMING = [
    'org.tizen.netflix-app', 'MCmYXNxgcu.DisneyPlus', '9Ur5IzDKqV.TizenYouTube',
    'org.tizen.primevideo', 'org.tizen.ardmediathek', 'org.tizen.zdfmediathek',
    'org.tizen.rtlplus', 'org.tizen.sat1', 'org.tizen.prosieben',
    'org.tizen.kabel1', 'org.tizen.vox', 'org.tizen.sixx',
    'org.tizen.sport1', 'org.tizen.eurosport', 'org.tizen.joyn',
    'org.tizen.tvnow', 'org.tizen.sky', 'org.tizen.wowo',
    'org.tizen.twitch', 'rJeHak5zRg.Spotify', 'org.tizen.deezer',
    'as6cYRgkPy.Binge', '73iTZRTc34.Stan', '5b8c3eb16b.BeamCTVDev',
    'KaLitts8bq.tenplaySamsungTizen', 'eYuOiOLYQX.KayoSports', 'Ne2ZsPWdKl.9NOW',
    '3KA0pm7a7V.TubiTV', 'icp4AvUPiA.7plus'
  ];
  
  // System-Apps (nicht in der App-Liste anzeigen)
  var CONSUMER_SYSTEM = ['org.tizen.browser', 'com.microsoft.copilot', 'com.samsung.tv.gallery'];
  
  // Zusätzliche Marken-Zuordnungen
  var EXTRA_BRANDS = {
    'rJeHak5zRg.Spotify': 'spotify',
    '5b8c3eb16b.BeamCTVDev': 'hbomax',
    '3KA0pm7a7V.TubiTV': 'tubi',
    'org.tizen.ardmediathek': 'ard',
    'org.tizen.zdfmediathek': 'zdf',
    'org.tizen.rtlplus': 'rtlplus',
    'org.tizen.sat1': 'sat1',
    'org.tizen.prosieben': 'prosieben',
    'org.tizen.kabel1': 'kabel1',
    'org.tizen.sport1': 'sport1',
    'org.tizen.joyn': 'joyn',
    'org.tizen.tvnow': 'tvnow'
  };
  
  // Interne Samsung-Apps (ausblenden)
  var INTERNAL = [
    'adplatform.ADPlayer', 'WykOS4t4F0.cmsWebApp', '25emanual3.emanual',
    'ZODRT12q2l.WebAccountExtension', 'ByJlgt0XeD.CastSettingsApp', 'tv6pbVMQFF.PrivacyChoices',
    'com.samsung.tv.csfs', 'com.samsung.tv.cobalt-yt', 'com.samsung.tv.aria'
  ];
  
  // Eigene App-ID für NU7179
  var SELF = 'com.example.CleanFrameNU7179';
  
  function api() { return window.tizen && window.tizen.application; }
  
  function unavailable(done) {
    done({ message: 'Öffne CleanFrame auf dem TV, um diese Funktion zu nutzen.', detail: 'Die Browser-Vorschau kann den TV nicht steuern.' });
  }
  
  function failure(err) {
    return { message: 'Der TV konnte diesen Bildschirm nicht öffnen.', detail: err && (err.message || err.name) || 'Versuche es erneut oder drücke die Home-Taste auf der Fernbedienung, um zu CleanFrame zurückzukehren.' };
  }
  
  function bounded(done) {
    var finished = false, timer = setTimeout(function () { finish({ message: 'Der TV hat nicht reagiert. Bitte versuche es erneut.' }); }, 8000);
    function finish(err, value) { if (finished) return; finished = true; clearTimeout(timer); done(err, value); }
    return finish;
  }
  
  function launchApp(id, done) {
    if (!api()) { unavailable(done); return; }
    var finish = bounded(done);
    try { api().launch(id, function () { finish(null); }, function (err) { finish(failure(err)); }); }
    catch (err) { finish(failure(err)); }
  }
  
  function launch(brand, done) {
    if (!IDS[brand]) { done({message: 'Diese App hat kein Startziel.'}); return; }
    launchApp(IDS[brand], done);
  }
  
  function art(done) {
    if (!api()) { unavailable(done); return; }
    var finish = bounded(done);
    try {
      var data = [new tizen.ApplicationControlData('mode', ['fullscreen']), new tizen.ApplicationControlData('requester', ['mobile'])];
      var control = new tizen.ApplicationControl('http://tizen.org/appcontrol/operation/default', null, null, null, data);
      api().launchAppControl(control, 'org.tizen.art-app', function () { finish(null); }, function (err) { finish(failure(err)); });
    } catch (err) { finish(failure(err)); }
  }
  
  function home(done) { launchApp('com.samsung.tv.csfs', done); }
  
  function settings(done) { launchApp('com.samsung.tv.coba.setting', done); }
  
  function apps(done) {
    if (!api()) { unavailable(done); return; }
    var finish = bounded(done);
    try {
      api().getAppsInfo(function (list) {
        var known = {}, seen = {}, result = [];
        Object.keys(IDS).forEach(function (brand) { known[IDS[brand]] = brand; });
        list.forEach(function (a) {
          var primary = !!known[a.id], stream = STREAMING.indexOf(a.id) >= 0;
          var consumer = /^[A-Za-z0-9]{10}\.[A-Za-z0-9_-]+$/.test(a.id) || CONSUMER_SYSTEM.indexOf(a.id) >= 0;
          if (a.id === SELF || INTERNAL.indexOf(a.id) >= 0 || seen[a.id] || !a.name || (!primary && !stream && (!a.show || !consumer))) return;
          if (!primary && /(?:service|worker|preview|promotion|plugin|launcher|test|sdk|^ep[ -]|factory|daemon)/i.test(a.name + ' ' + a.id)) return;
          if (/-dummy$/.test(a.id) || a.id === 'com.samsung.tv.cobalt-yt') return;
          seen[a.id] = true;
          result.push({ appId: a.id, name: a.name, brand: known[a.id] || EXTRA_BRANDS[a.id] || '', icon: a.iconPath || '', rank: primary ? Object.keys(IDS).indexOf(known[a.id]) : (stream ? 20 : 30) });
        });
        result.sort(function (a, b) { return a.rank - b.rank || a.name.toLowerCase().localeCompare(b.name.toLowerCase()); });
        finish(null, result);
      }, function (err) { finish(failure(err)); });
    } catch (err) { finish(failure(err)); }
  }
  
  window.FrameDevice = { launch: launch, launchApp: launchApp, art: art, home: home, settings: settings, apps: apps };
}());
