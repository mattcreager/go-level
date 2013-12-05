(function() {
  'use strict';
  var location = 'https://goinstant.net/mattcreager/DingDong/zonk';

  var db = levelup(location, { db: GoLevel });

  db.put('foo', 'bar', function (err) {
    if (err) throw err;

    db.get('foo', function (err, value) {
      if (err) throw err;
      console.log('Got foo =', value);
    });
  });
})();