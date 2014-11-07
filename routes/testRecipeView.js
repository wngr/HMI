/**
 * New node file
 */

console.log('testRecipeView.js / root');
// SystemTime
setInterval(function() {
  IO.emit('serverTime', Date().toString());
}, 1000);

function index(req, res) {
  var jadeData = new Object;
  var recipeInterface = require('./../models/simpleRecipeInterface');

  recipeIdArray = [ 1, 2 ]; // Mockdata
  recipeInterface.getRecipes(recipeIdArray, function(err, recipes) {
    if (err) {
      jadeData.error = err;
    } else {
      jadeData.recipes = recipes;
      console.log(JSON.stringify(recipes));
    }

    res.render('bootstrap/testRecipeView', jadeData);
    res.end();
  });
}
exports.index = index;

/**
 * View to place the order
 * 
 * @post
 * @author Thomas Frei
 */
exports.placeOrder = function(req, res) {
  console.log(req.body);
  console.log(req.query);
  var recipeId = req.query.recipeId;

  //
  var taskId = _.uniqueId();

  var postParameters = req.body.userparameter;
  var userParameters = new Array;
  postParameters.forEach(function(value) {
    userParameters.push({
      Value : value
    });
  });

  var queueInterface = require('./../models/recipeInterface');
  // recipeInterface.setRecipeUrl('opc.tcp://localhost:4334/');
  recipeInterface.setRecipeUrl('opc.tcp://192.168.175.230:4840/');
  queueInterface.order(recipeId, userParameters, function() {
    console.log('order set');
  });

  var jadeData = {
    content : 'Order has been placed! The corresponding (unique) TaskID is :' + taskId,
    list : [ {
      href : '/taskViewTest?taskId=' + taskId,
      title : 'Redirect to specific TaskView'
    }, {
      href : '/taskViewTest',
      title : 'Redirect to global TaskView'
    } ]
  };
  res.render('bootstrap/blank', jadeData);
  res.end();
}

/**
 * Mockup for Bjoern, to develop slider
 * 
 * @static
 * @author Thomas Frei
 */
exports.mockup = function(req, res) {
  var jadeData = {
    recipes : [
        {
          "Description" : {
            "nodeId" : "MI5.Recipe[1].Description",
            "value" : "This recipe lets the XTS transport and block/unblock on 3 different stations",
            "submitEvent" : "submitEvMI5.Recipe[1].Description",
            "updateEvent" : "updateEvMI5.Recipe[1].Description",
            "containerId" : "id6b7e3df0aade64abe5c3446149cd78d1"
          },
          "Dummy" : {
            "nodeId" : "MI5.Recipe[1].Dummy",
            "value" : false,
            "submitEvent" : "submitEvMI5.Recipe[1].Dummy",
            "updateEvent" : "updateEvMI5.Recipe[1].Dummy",
            "containerId" : "id2f84dbd23f9151e775c2bac9d250f00d"
          },
          "Name" : {
            "nodeId" : "MI5.Recipe[1].Name",
            "value" : "XTS Test Recipe",
            "submitEvent" : "submitEvMI5.Recipe[1].Name",
            "updateEvent" : "updateEvMI5.Recipe[1].Name",
            "containerId" : "idd7ce875dd158e8cf3de8cf5c629b01e2"
          },
          "RecipeID" : {
            "nodeId" : "MI5.Recipe[1].RecipeID",
            "value" : 10010,
            "submitEvent" : "submitEvMI5.Recipe[1].RecipeID",
            "updateEvent" : "updateEvMI5.Recipe[1].RecipeID",
            "containerId" : "id674f3a1d8edd506c75481ed1d1de1634"
          },
          "UserParameters" : [ {
            "Default" : {
              "nodeId" : "MI5.Recipe[1].UserParameter[0].Default",
              "value" : 0,
              "submitEvent" : "submitEvMI5.Recipe[1].UserParameter[0].Default",
              "updateEvent" : "updateEvMI5.Recipe[1].UserParameter[0].Default",
              "containerId" : "id2f98aaab641217411a1d3a7d442d35e7"
            },
            "Description" : {
              "nodeId" : "MI5.Recipe[1].UserParameter[0].Description",
              "value" : "",
              "submitEvent" : "submitEvMI5.Recipe[1].UserParameter[0].Description",
              "updateEvent" : "updateEvMI5.Recipe[1].UserParameter[0].Description",
              "containerId" : "id1f2890d3aafc0f58ed3f161fed8afb8e"
            },
            "Dummy" : {
              "nodeId" : "MI5.Recipe[1].UserParameter[0].Dummy",
              "value" : true,
              "submitEvent" : "submitEvMI5.Recipe[1].UserParameter[0].Dummy",
              "updateEvent" : "updateEvMI5.Recipe[1].UserParameter[0].Dummy",
              "containerId" : "id489319aa8da18aa3e50c7f8f679e2727"
            },
            "MaxValue" : {
              "nodeId" : "MI5.Recipe[1].UserParameter[0].MaxValue",
              "value" : 0,
              "submitEvent" : "submitEvMI5.Recipe[1].UserParameter[0].MaxValue",
              "updateEvent" : "updateEvMI5.Recipe[1].UserParameter[0].MaxValue",
              "containerId" : "id15183a6a26cabc84ac5c5a83d201f474"
            },
            "MinValue" : {
              "nodeId" : "MI5.Recipe[1].UserParameter[0].MinValue",
              "value" : 0,
              "submitEvent" : "submitEvMI5.Recipe[1].UserParameter[0].MinValue",
              "updateEvent" : "updateEvMI5.Recipe[1].UserParameter[0].MinValue",
              "containerId" : "id39ef1e5d8650cde448de799076ca5e18"
            },
            "Name" : {
              "nodeId" : "MI5.Recipe[1].UserParameter[0].Name",
              "value" : "",
              "submitEvent" : "submitEvMI5.Recipe[1].UserParameter[0].Name",
              "updateEvent" : "updateEvMI5.Recipe[1].UserParameter[0].Name",
              "containerId" : "id52a89c5031cb3b7b92fea4b59d5d1626"
            },
            "Step" : {
              "nodeId" : "MI5.Recipe[1].UserParameter[0].Step",
              "value" : 0,
              "submitEvent" : "submitEvMI5.Recipe[1].UserParameter[0].Step",
              "updateEvent" : "updateEvMI5.Recipe[1].UserParameter[0].Step",
              "containerId" : "id0cea3e34e1d156ba509605b33096feb7"
            },
            "Unit" : {
              "nodeId" : "MI5.Recipe[1].UserParameter[0].Unit",
              "value" : "",
              "submitEvent" : "submitEvMI5.Recipe[1].UserParameter[0].Unit",
              "updateEvent" : "updateEvMI5.Recipe[1].UserParameter[0].Unit",
              "containerId" : "id48228e4baa6f84de127384173b9f4d24"
            }
          }, {
            "Default" : {
              "nodeId" : "MI5.Recipe[1].UserParameter[1].Default",
              "value" : 0,
              "submitEvent" : "submitEvMI5.Recipe[1].UserParameter[1].Default",
              "updateEvent" : "updateEvMI5.Recipe[1].UserParameter[1].Default",
              "containerId" : "id1e53f0ddb44f12248fc796a71a398b18"
            },
            "Description" : {
              "nodeId" : "MI5.Recipe[1].UserParameter[1].Description",
              "value" : "",
              "submitEvent" : "submitEvMI5.Recipe[1].UserParameter[1].Description",
              "updateEvent" : "updateEvMI5.Recipe[1].UserParameter[1].Description",
              "containerId" : "id25de87f7dd9fdc25dbc5ab0f140e30d8"
            },
            "Dummy" : {
              "nodeId" : "MI5.Recipe[1].UserParameter[1].Dummy",
              "value" : true,
              "submitEvent" : "submitEvMI5.Recipe[1].UserParameter[1].Dummy",
              "updateEvent" : "updateEvMI5.Recipe[1].UserParameter[1].Dummy",
              "containerId" : "id0221df8421e1a106e8975a36e469e1d1"
            },
            "MaxValue" : {
              "nodeId" : "MI5.Recipe[1].UserParameter[1].MaxValue",
              "value" : 0,
              "submitEvent" : "submitEvMI5.Recipe[1].UserParameter[1].MaxValue",
              "updateEvent" : "updateEvMI5.Recipe[1].UserParameter[1].MaxValue",
              "containerId" : "id8c8af79d0c8940dd5d004a830a3fd570"
            },
            "MinValue" : {
              "nodeId" : "MI5.Recipe[1].UserParameter[1].MinValue",
              "value" : 0,
              "submitEvent" : "submitEvMI5.Recipe[1].UserParameter[1].MinValue",
              "updateEvent" : "updateEvMI5.Recipe[1].UserParameter[1].MinValue",
              "containerId" : "id4533c3a01e83cbb900b441ad342a662e"
            },
            "Name" : {
              "nodeId" : "MI5.Recipe[1].UserParameter[1].Name",
              "value" : "",
              "submitEvent" : "submitEvMI5.Recipe[1].UserParameter[1].Name",
              "updateEvent" : "updateEvMI5.Recipe[1].UserParameter[1].Name",
              "containerId" : "id01700a324ed938ac5b01852ffaec9ffe"
            },
            "Step" : {
              "nodeId" : "MI5.Recipe[1].UserParameter[1].Step",
              "value" : 0,
              "submitEvent" : "submitEvMI5.Recipe[1].UserParameter[1].Step",
              "updateEvent" : "updateEvMI5.Recipe[1].UserParameter[1].Step",
              "containerId" : "idd1896a10a376eaa2504492894fe01f6c"
            },
            "Unit" : {
              "nodeId" : "MI5.Recipe[1].UserParameter[1].Unit",
              "value" : "",
              "submitEvent" : "submitEvMI5.Recipe[1].UserParameter[1].Unit",
              "updateEvent" : "updateEvMI5.Recipe[1].UserParameter[1].Unit",
              "containerId" : "id18d53d811b61d41534215e0556f2523f"
            }
          }, {
            "Default" : {
              "nodeId" : "MI5.Recipe[1].UserParameter[2].Default",
              "value" : 0,
              "submitEvent" : "submitEvMI5.Recipe[1].UserParameter[2].Default",
              "updateEvent" : "updateEvMI5.Recipe[1].UserParameter[2].Default",
              "containerId" : "ide42f40976c51f1707a11220897910774"
            },
            "Description" : {
              "nodeId" : "MI5.Recipe[1].UserParameter[2].Description",
              "value" : "",
              "submitEvent" : "submitEvMI5.Recipe[1].UserParameter[2].Description",
              "updateEvent" : "updateEvMI5.Recipe[1].UserParameter[2].Description",
              "containerId" : "id6f6409f9e19f8ea0136eae829047b867"
            },
            "Dummy" : {
              "nodeId" : "MI5.Recipe[1].UserParameter[2].Dummy",
              "value" : true,
              "submitEvent" : "submitEvMI5.Recipe[1].UserParameter[2].Dummy",
              "updateEvent" : "updateEvMI5.Recipe[1].UserParameter[2].Dummy",
              "containerId" : "id1019b6b27d8ffa25b540922eb551248f"
            },
            "MaxValue" : {
              "nodeId" : "MI5.Recipe[1].UserParameter[2].MaxValue",
              "value" : 0,
              "submitEvent" : "submitEvMI5.Recipe[1].UserParameter[2].MaxValue",
              "updateEvent" : "updateEvMI5.Recipe[1].UserParameter[2].MaxValue",
              "containerId" : "id86e6aa5912b805cd1248833be9695413"
            },
            "MinValue" : {
              "nodeId" : "MI5.Recipe[1].UserParameter[2].MinValue",
              "value" : 0,
              "submitEvent" : "submitEvMI5.Recipe[1].UserParameter[2].MinValue",
              "updateEvent" : "updateEvMI5.Recipe[1].UserParameter[2].MinValue",
              "containerId" : "id64b46be8f2750dd2c64da3a239bed2c1"
            },
            "Name" : {
              "nodeId" : "MI5.Recipe[1].UserParameter[2].Name",
              "value" : "",
              "submitEvent" : "submitEvMI5.Recipe[1].UserParameter[2].Name",
              "updateEvent" : "updateEvMI5.Recipe[1].UserParameter[2].Name",
              "containerId" : "ide0df904446fb6a9a193f714d2af6aede"
            },
            "Step" : {
              "nodeId" : "MI5.Recipe[1].UserParameter[2].Step",
              "value" : 0,
              "submitEvent" : "submitEvMI5.Recipe[1].UserParameter[2].Step",
              "updateEvent" : "updateEvMI5.Recipe[1].UserParameter[2].Step",
              "containerId" : "id668504abee248d220a5dc1a07e5012c8"
            },
            "Unit" : {
              "nodeId" : "MI5.Recipe[1].UserParameter[2].Unit",
              "value" : "",
              "submitEvent" : "submitEvMI5.Recipe[1].UserParameter[2].Unit",
              "updateEvent" : "updateEvMI5.Recipe[1].UserParameter[2].Unit",
              "containerId" : "id48e15f3b566d4ed9bd61fe9ac365986e"
            }
          }, {
            "Default" : {
              "nodeId" : "MI5.Recipe[1].UserParameter[3].Default",
              "value" : 0,
              "submitEvent" : "submitEvMI5.Recipe[1].UserParameter[3].Default",
              "updateEvent" : "updateEvMI5.Recipe[1].UserParameter[3].Default",
              "containerId" : "id2d4a82f962b74cdebaff5d0e8ac88ea6"
            },
            "Description" : {
              "nodeId" : "MI5.Recipe[1].UserParameter[3].Description",
              "value" : "",
              "submitEvent" : "submitEvMI5.Recipe[1].UserParameter[3].Description",
              "updateEvent" : "updateEvMI5.Recipe[1].UserParameter[3].Description",
              "containerId" : "idd46725765bb75fa56d5fd0f23b02760f"
            },
            "Dummy" : {
              "nodeId" : "MI5.Recipe[1].UserParameter[3].Dummy",
              "value" : true,
              "submitEvent" : "submitEvMI5.Recipe[1].UserParameter[3].Dummy",
              "updateEvent" : "updateEvMI5.Recipe[1].UserParameter[3].Dummy",
              "containerId" : "ide03fa459a5949d1f405a20093128f9a8"
            },
            "MaxValue" : {
              "nodeId" : "MI5.Recipe[1].UserParameter[3].MaxValue",
              "value" : 0,
              "submitEvent" : "submitEvMI5.Recipe[1].UserParameter[3].MaxValue",
              "updateEvent" : "updateEvMI5.Recipe[1].UserParameter[3].MaxValue",
              "containerId" : "idac4f9f9278e31e483aa05fe465ae93d6"
            },
            "MinValue" : {
              "nodeId" : "MI5.Recipe[1].UserParameter[3].MinValue",
              "value" : 0,
              "submitEvent" : "submitEvMI5.Recipe[1].UserParameter[3].MinValue",
              "updateEvent" : "updateEvMI5.Recipe[1].UserParameter[3].MinValue",
              "containerId" : "id86a4d86192cdfa114c986e40519a33e3"
            },
            "Name" : {
              "nodeId" : "MI5.Recipe[1].UserParameter[3].Name",
              "value" : "",
              "submitEvent" : "submitEvMI5.Recipe[1].UserParameter[3].Name",
              "updateEvent" : "updateEvMI5.Recipe[1].UserParameter[3].Name",
              "containerId" : "idbac1b20389691e3bc491884ef094db83"
            },
            "Step" : {
              "nodeId" : "MI5.Recipe[1].UserParameter[3].Step",
              "value" : 0,
              "submitEvent" : "submitEvMI5.Recipe[1].UserParameter[3].Step",
              "updateEvent" : "updateEvMI5.Recipe[1].UserParameter[3].Step",
              "containerId" : "id2c7455d19a423f1b595f6e1510ad7cdc"
            },
            "Unit" : {
              "nodeId" : "MI5.Recipe[1].UserParameter[3].Unit",
              "value" : "",
              "submitEvent" : "submitEvMI5.Recipe[1].UserParameter[3].Unit",
              "updateEvent" : "updateEvMI5.Recipe[1].UserParameter[3].Unit",
              "containerId" : "id00a6329c84a176cbf507f21ac6c27fbf"
            }
          }, {
            "Default" : {
              "nodeId" : "MI5.Recipe[1].UserParameter[4].Default",
              "value" : 0,
              "submitEvent" : "submitEvMI5.Recipe[1].UserParameter[4].Default",
              "updateEvent" : "updateEvMI5.Recipe[1].UserParameter[4].Default",
              "containerId" : "idf11e373d939f995b52b05090a39b64ea"
            },
            "Description" : {
              "nodeId" : "MI5.Recipe[1].UserParameter[4].Description",
              "value" : "",
              "submitEvent" : "submitEvMI5.Recipe[1].UserParameter[4].Description",
              "updateEvent" : "updateEvMI5.Recipe[1].UserParameter[4].Description",
              "containerId" : "id42cd69e2eecd604a9e29482ddfdf27b1"
            },
            "Dummy" : {
              "nodeId" : "MI5.Recipe[1].UserParameter[4].Dummy",
              "value" : true,
              "submitEvent" : "submitEvMI5.Recipe[1].UserParameter[4].Dummy",
              "updateEvent" : "updateEvMI5.Recipe[1].UserParameter[4].Dummy",
              "containerId" : "id523e89b62ddc662fe9996991a4ee9ae4"
            },
            "MaxValue" : {
              "nodeId" : "MI5.Recipe[1].UserParameter[4].MaxValue",
              "value" : 0,
              "submitEvent" : "submitEvMI5.Recipe[1].UserParameter[4].MaxValue",
              "updateEvent" : "updateEvMI5.Recipe[1].UserParameter[4].MaxValue",
              "containerId" : "id0cce02274482a0e8a7033a8def6cd8f4"
            },
            "MinValue" : {
              "nodeId" : "MI5.Recipe[1].UserParameter[4].MinValue",
              "value" : 0,
              "submitEvent" : "submitEvMI5.Recipe[1].UserParameter[4].MinValue",
              "updateEvent" : "updateEvMI5.Recipe[1].UserParameter[4].MinValue",
              "containerId" : "id903798a2e10c81e3ddb1a930371306d7"
            },
            "Name" : {
              "nodeId" : "MI5.Recipe[1].UserParameter[4].Name",
              "value" : "",
              "submitEvent" : "submitEvMI5.Recipe[1].UserParameter[4].Name",
              "updateEvent" : "updateEvMI5.Recipe[1].UserParameter[4].Name",
              "containerId" : "idc67d9cbcddecdfadd18d5317c4838350"
            },
            "Step" : {
              "nodeId" : "MI5.Recipe[1].UserParameter[4].Step",
              "value" : 0,
              "submitEvent" : "submitEvMI5.Recipe[1].UserParameter[4].Step",
              "updateEvent" : "updateEvMI5.Recipe[1].UserParameter[4].Step",
              "containerId" : "id44fd5edbaa068280113bce638660ebe4"
            },
            "Unit" : {
              "nodeId" : "MI5.Recipe[1].UserParameter[4].Unit",
              "value" : "",
              "submitEvent" : "submitEvMI5.Recipe[1].UserParameter[4].Unit",
              "updateEvent" : "updateEvMI5.Recipe[1].UserParameter[4].Unit",
              "containerId" : "id293a0b8592afe049d562eac3d1cc3797"
            }
          }, {
            "Default" : {
              "nodeId" : "MI5.Recipe[1].UserParameter[5].Default",
              "value" : 0,
              "submitEvent" : "submitEvMI5.Recipe[1].UserParameter[5].Default",
              "updateEvent" : "updateEvMI5.Recipe[1].UserParameter[5].Default",
              "containerId" : "id4cfacc02c5d3a8774252c247bafb638b"
            },
            "Description" : {
              "nodeId" : "MI5.Recipe[1].UserParameter[5].Description",
              "value" : "",
              "submitEvent" : "submitEvMI5.Recipe[1].UserParameter[5].Description",
              "updateEvent" : "updateEvMI5.Recipe[1].UserParameter[5].Description",
              "containerId" : "id4dc944b295e41437f8f5b0da231fa479"
            },
            "Dummy" : {
              "nodeId" : "MI5.Recipe[1].UserParameter[5].Dummy",
              "value" : true,
              "submitEvent" : "submitEvMI5.Recipe[1].UserParameter[5].Dummy",
              "updateEvent" : "updateEvMI5.Recipe[1].UserParameter[5].Dummy",
              "containerId" : "ida0c7653687a4d58adc3bd2193dc9a6ce"
            },
            "MaxValue" : {
              "nodeId" : "MI5.Recipe[1].UserParameter[5].MaxValue",
              "value" : 0,
              "submitEvent" : "submitEvMI5.Recipe[1].UserParameter[5].MaxValue",
              "updateEvent" : "updateEvMI5.Recipe[1].UserParameter[5].MaxValue",
              "containerId" : "id6fc18cc036622c3f9270a093f55e316a"
            },
            "MinValue" : {
              "nodeId" : "MI5.Recipe[1].UserParameter[5].MinValue",
              "value" : 0,
              "submitEvent" : "submitEvMI5.Recipe[1].UserParameter[5].MinValue",
              "updateEvent" : "updateEvMI5.Recipe[1].UserParameter[5].MinValue",
              "containerId" : "ida90682f8231ae89cc521240f7b66a2d9"
            },
            "Name" : {
              "nodeId" : "MI5.Recipe[1].UserParameter[5].Name",
              "value" : "",
              "submitEvent" : "submitEvMI5.Recipe[1].UserParameter[5].Name",
              "updateEvent" : "updateEvMI5.Recipe[1].UserParameter[5].Name",
              "containerId" : "id99a03e68edc789822b209a9a67503a57"
            },
            "Step" : {
              "nodeId" : "MI5.Recipe[1].UserParameter[5].Step",
              "value" : 0,
              "submitEvent" : "submitEvMI5.Recipe[1].UserParameter[5].Step",
              "updateEvent" : "updateEvMI5.Recipe[1].UserParameter[5].Step",
              "containerId" : "id7675d1b55b768d807495da2c468d141e"
            },
            "Unit" : {
              "nodeId" : "MI5.Recipe[1].UserParameter[5].Unit",
              "value" : "",
              "submitEvent" : "submitEvMI5.Recipe[1].UserParameter[5].Unit",
              "updateEvent" : "updateEvMI5.Recipe[1].UserParameter[5].Unit",
              "containerId" : "ide9e03ff92d5f69efd25858a043faffca"
            }
          } ]
        },
        {
          "Description" : {
            "nodeId" : "MI5.Recipe[2].Description",
            "value" : "This Recipe produces a simple, but still delicious two-layer Cookie with Chocolate inside",
            "submitEvent" : "submitEvMI5.Recipe[2].Description",
            "updateEvent" : "updateEvMI5.Recipe[2].Description",
            "containerId" : "id2f06bfa7a00cc90ab7aff8920adb22ad"
          },
          "Dummy" : {
            "nodeId" : "MI5.Recipe[2].Dummy",
            "value" : false,
            "submitEvent" : "submitEvMI5.Recipe[2].Dummy",
            "updateEvent" : "updateEvMI5.Recipe[2].Dummy",
            "containerId" : "id0e89f3a7997f8792adf82b957018592c"
          },
          "Name" : {
            "nodeId" : "MI5.Recipe[2].Name",
            "value" : "Simple Chocolate Cookie",
            "submitEvent" : "submitEvMI5.Recipe[2].Name",
            "updateEvent" : "updateEvMI5.Recipe[2].Name",
            "containerId" : "idc4e15673a4d1f13ee78514c55940bc5d"
          },
          "RecipeID" : {
            "nodeId" : "MI5.Recipe[2].RecipeID",
            "value" : 10014,
            "submitEvent" : "submitEvMI5.Recipe[2].RecipeID",
            "updateEvent" : "updateEvMI5.Recipe[2].RecipeID",
            "containerId" : "id7f36a5b8c736a29e9e914a52a4b82a8b"
          },
          "UserParameters" : [ {
            "Default" : {
              "nodeId" : "MI5.Recipe[2].UserParameter[0].Default",
              "value" : 0,
              "submitEvent" : "submitEvMI5.Recipe[2].UserParameter[0].Default",
              "updateEvent" : "updateEvMI5.Recipe[2].UserParameter[0].Default",
              "containerId" : "idd678c874084e513463c100056706728d"
            },
            "Description" : {
              "nodeId" : "MI5.Recipe[2].UserParameter[0].Description",
              "value" : "",
              "submitEvent" : "submitEvMI5.Recipe[2].UserParameter[0].Description",
              "updateEvent" : "updateEvMI5.Recipe[2].UserParameter[0].Description",
              "containerId" : "id07c0f61054ed48e20c1724611076a2f4"
            },
            "Dummy" : {
              "nodeId" : "MI5.Recipe[2].UserParameter[0].Dummy",
              "value" : true,
              "submitEvent" : "submitEvMI5.Recipe[2].UserParameter[0].Dummy",
              "updateEvent" : "updateEvMI5.Recipe[2].UserParameter[0].Dummy",
              "containerId" : "id178f2646fb6009099e006ac709021423"
            },
            "MaxValue" : {
              "nodeId" : "MI5.Recipe[2].UserParameter[0].MaxValue",
              "value" : 0,
              "submitEvent" : "submitEvMI5.Recipe[2].UserParameter[0].MaxValue",
              "updateEvent" : "updateEvMI5.Recipe[2].UserParameter[0].MaxValue",
              "containerId" : "iddf24af471c6b97d1268f11e9cdddf9aa"
            },
            "MinValue" : {
              "nodeId" : "MI5.Recipe[2].UserParameter[0].MinValue",
              "value" : 0,
              "submitEvent" : "submitEvMI5.Recipe[2].UserParameter[0].MinValue",
              "updateEvent" : "updateEvMI5.Recipe[2].UserParameter[0].MinValue",
              "containerId" : "id34e0e1e834cd65d3c182cd22d047d9c4"
            },
            "Name" : {
              "nodeId" : "MI5.Recipe[2].UserParameter[0].Name",
              "value" : "",
              "submitEvent" : "submitEvMI5.Recipe[2].UserParameter[0].Name",
              "updateEvent" : "updateEvMI5.Recipe[2].UserParameter[0].Name",
              "containerId" : "id870a958c9d97733c6770289325191148"
            },
            "Step" : {
              "nodeId" : "MI5.Recipe[2].UserParameter[0].Step",
              "value" : 0,
              "submitEvent" : "submitEvMI5.Recipe[2].UserParameter[0].Step",
              "updateEvent" : "updateEvMI5.Recipe[2].UserParameter[0].Step",
              "containerId" : "id1b49c71c9db50b0cb6f94872a8431581"
            },
            "Unit" : {
              "nodeId" : "MI5.Recipe[2].UserParameter[0].Unit",
              "value" : "",
              "submitEvent" : "submitEvMI5.Recipe[2].UserParameter[0].Unit",
              "updateEvent" : "updateEvMI5.Recipe[2].UserParameter[0].Unit",
              "containerId" : "id122ca4cacbcf03fc28a74a7cd6dea856"
            }
          }, {
            "Default" : {
              "nodeId" : "MI5.Recipe[2].UserParameter[1].Default",
              "value" : 0,
              "submitEvent" : "submitEvMI5.Recipe[2].UserParameter[1].Default",
              "updateEvent" : "updateEvMI5.Recipe[2].UserParameter[1].Default",
              "containerId" : "id874b46693cbd7e69b778c3928f0dab1e"
            },
            "Description" : {
              "nodeId" : "MI5.Recipe[2].UserParameter[1].Description",
              "value" : "",
              "submitEvent" : "submitEvMI5.Recipe[2].UserParameter[1].Description",
              "updateEvent" : "updateEvMI5.Recipe[2].UserParameter[1].Description",
              "containerId" : "id4af0d989eedfb23fa43efc595e64e70d"
            },
            "Dummy" : {
              "nodeId" : "MI5.Recipe[2].UserParameter[1].Dummy",
              "value" : true,
              "submitEvent" : "submitEvMI5.Recipe[2].UserParameter[1].Dummy",
              "updateEvent" : "updateEvMI5.Recipe[2].UserParameter[1].Dummy",
              "containerId" : "idfa45019177c8f03b87d93447e451bbe1"
            },
            "MaxValue" : {
              "nodeId" : "MI5.Recipe[2].UserParameter[1].MaxValue",
              "value" : 0,
              "submitEvent" : "submitEvMI5.Recipe[2].UserParameter[1].MaxValue",
              "updateEvent" : "updateEvMI5.Recipe[2].UserParameter[1].MaxValue",
              "containerId" : "idd3aa8a3554e31f87b4be2f1d9fafc292"
            },
            "MinValue" : {
              "nodeId" : "MI5.Recipe[2].UserParameter[1].MinValue",
              "value" : 0,
              "submitEvent" : "submitEvMI5.Recipe[2].UserParameter[1].MinValue",
              "updateEvent" : "updateEvMI5.Recipe[2].UserParameter[1].MinValue",
              "containerId" : "id18fddaa384f7d612e348dedf3297ae39"
            },
            "Name" : {
              "nodeId" : "MI5.Recipe[2].UserParameter[1].Name",
              "value" : "",
              "submitEvent" : "submitEvMI5.Recipe[2].UserParameter[1].Name",
              "updateEvent" : "updateEvMI5.Recipe[2].UserParameter[1].Name",
              "containerId" : "idf16631912fbb1faee518cd9c97041dcb"
            },
            "Step" : {
              "nodeId" : "MI5.Recipe[2].UserParameter[1].Step",
              "value" : 0,
              "submitEvent" : "submitEvMI5.Recipe[2].UserParameter[1].Step",
              "updateEvent" : "updateEvMI5.Recipe[2].UserParameter[1].Step",
              "containerId" : "id0dcc6aa47f5f75847c3bf99d824c602b"
            },
            "Unit" : {
              "nodeId" : "MI5.Recipe[2].UserParameter[1].Unit",
              "value" : "",
              "submitEvent" : "submitEvMI5.Recipe[2].UserParameter[1].Unit",
              "updateEvent" : "updateEvMI5.Recipe[2].UserParameter[1].Unit",
              "containerId" : "idb484a37ba0e6036f4dfc1d03a58236b3"
            }
          }, {
            "Default" : {
              "nodeId" : "MI5.Recipe[2].UserParameter[2].Default",
              "value" : 0,
              "submitEvent" : "submitEvMI5.Recipe[2].UserParameter[2].Default",
              "updateEvent" : "updateEvMI5.Recipe[2].UserParameter[2].Default",
              "containerId" : "id681f01b456f6acc6cffcffa0ca2b5d3f"
            },
            "Description" : {
              "nodeId" : "MI5.Recipe[2].UserParameter[2].Description",
              "value" : "",
              "submitEvent" : "submitEvMI5.Recipe[2].UserParameter[2].Description",
              "updateEvent" : "updateEvMI5.Recipe[2].UserParameter[2].Description",
              "containerId" : "ida23ad7f65cee151e57f524413753810c"
            },
            "Dummy" : {
              "nodeId" : "MI5.Recipe[2].UserParameter[2].Dummy",
              "value" : true,
              "submitEvent" : "submitEvMI5.Recipe[2].UserParameter[2].Dummy",
              "updateEvent" : "updateEvMI5.Recipe[2].UserParameter[2].Dummy",
              "containerId" : "id38e961576253c1878a54b3714bdc8100"
            },
            "MaxValue" : {
              "nodeId" : "MI5.Recipe[2].UserParameter[2].MaxValue",
              "value" : 0,
              "submitEvent" : "submitEvMI5.Recipe[2].UserParameter[2].MaxValue",
              "updateEvent" : "updateEvMI5.Recipe[2].UserParameter[2].MaxValue",
              "containerId" : "idd36ca4f3ab3d421596c5f02003c7bd12"
            },
            "MinValue" : {
              "nodeId" : "MI5.Recipe[2].UserParameter[2].MinValue",
              "value" : 0,
              "submitEvent" : "submitEvMI5.Recipe[2].UserParameter[2].MinValue",
              "updateEvent" : "updateEvMI5.Recipe[2].UserParameter[2].MinValue",
              "containerId" : "id6931bc5ab5f2b7e649ec32fd6d883dac"
            },
            "Name" : {
              "nodeId" : "MI5.Recipe[2].UserParameter[2].Name",
              "value" : "",
              "submitEvent" : "submitEvMI5.Recipe[2].UserParameter[2].Name",
              "updateEvent" : "updateEvMI5.Recipe[2].UserParameter[2].Name",
              "containerId" : "idfe7bc5461f10d05adb06e68f10d8a55b"
            },
            "Step" : {
              "nodeId" : "MI5.Recipe[2].UserParameter[2].Step",
              "value" : 0,
              "submitEvent" : "submitEvMI5.Recipe[2].UserParameter[2].Step",
              "updateEvent" : "updateEvMI5.Recipe[2].UserParameter[2].Step",
              "containerId" : "id58be6cef891e6dc51aa216cf5d1d1582"
            },
            "Unit" : {
              "nodeId" : "MI5.Recipe[2].UserParameter[2].Unit",
              "value" : "",
              "submitEvent" : "submitEvMI5.Recipe[2].UserParameter[2].Unit",
              "updateEvent" : "updateEvMI5.Recipe[2].UserParameter[2].Unit",
              "containerId" : "idbb7749d2ee927b01662eb6d1f6cb1d6f"
            }
          }, {
            "Default" : {
              "nodeId" : "MI5.Recipe[2].UserParameter[3].Default",
              "value" : 0,
              "submitEvent" : "submitEvMI5.Recipe[2].UserParameter[3].Default",
              "updateEvent" : "updateEvMI5.Recipe[2].UserParameter[3].Default",
              "containerId" : "id0c6c927499b4df297fb2a1627fc3502e"
            },
            "Description" : {
              "nodeId" : "MI5.Recipe[2].UserParameter[3].Description",
              "value" : "",
              "submitEvent" : "submitEvMI5.Recipe[2].UserParameter[3].Description",
              "updateEvent" : "updateEvMI5.Recipe[2].UserParameter[3].Description",
              "containerId" : "id2713adfda6867688fd7f6c86cb36af86"
            },
            "Dummy" : {
              "nodeId" : "MI5.Recipe[2].UserParameter[3].Dummy",
              "value" : true,
              "submitEvent" : "submitEvMI5.Recipe[2].UserParameter[3].Dummy",
              "updateEvent" : "updateEvMI5.Recipe[2].UserParameter[3].Dummy",
              "containerId" : "ida1adaac6c9783f2b9abb360858edd367"
            },
            "MaxValue" : {
              "nodeId" : "MI5.Recipe[2].UserParameter[3].MaxValue",
              "value" : 0,
              "submitEvent" : "submitEvMI5.Recipe[2].UserParameter[3].MaxValue",
              "updateEvent" : "updateEvMI5.Recipe[2].UserParameter[3].MaxValue",
              "containerId" : "idc23cddc50126a1f78411e67d58a99071"
            },
            "MinValue" : {
              "nodeId" : "MI5.Recipe[2].UserParameter[3].MinValue",
              "value" : 0,
              "submitEvent" : "submitEvMI5.Recipe[2].UserParameter[3].MinValue",
              "updateEvent" : "updateEvMI5.Recipe[2].UserParameter[3].MinValue",
              "containerId" : "id958c31659554088fec26a4334b6c2a02"
            },
            "Name" : {
              "nodeId" : "MI5.Recipe[2].UserParameter[3].Name",
              "value" : "",
              "submitEvent" : "submitEvMI5.Recipe[2].UserParameter[3].Name",
              "updateEvent" : "updateEvMI5.Recipe[2].UserParameter[3].Name",
              "containerId" : "id44ccaf3fb3eeebf6235284d5146a009d"
            },
            "Step" : {
              "nodeId" : "MI5.Recipe[2].UserParameter[3].Step",
              "value" : 0,
              "submitEvent" : "submitEvMI5.Recipe[2].UserParameter[3].Step",
              "updateEvent" : "updateEvMI5.Recipe[2].UserParameter[3].Step",
              "containerId" : "idc61cd6d9b40c837614081d7ab8a545c4"
            },
            "Unit" : {
              "nodeId" : "MI5.Recipe[2].UserParameter[3].Unit",
              "value" : "",
              "submitEvent" : "submitEvMI5.Recipe[2].UserParameter[3].Unit",
              "updateEvent" : "updateEvMI5.Recipe[2].UserParameter[3].Unit",
              "containerId" : "id210206c658a2ead2d7f2ae7f6319312a"
            }
          }, {
            "Default" : {
              "nodeId" : "MI5.Recipe[2].UserParameter[4].Default",
              "value" : 0,
              "submitEvent" : "submitEvMI5.Recipe[2].UserParameter[4].Default",
              "updateEvent" : "updateEvMI5.Recipe[2].UserParameter[4].Default",
              "containerId" : "id8e1ad96a4ece56539590be7372e71840"
            },
            "Description" : {
              "nodeId" : "MI5.Recipe[2].UserParameter[4].Description",
              "value" : "",
              "submitEvent" : "submitEvMI5.Recipe[2].UserParameter[4].Description",
              "updateEvent" : "updateEvMI5.Recipe[2].UserParameter[4].Description",
              "containerId" : "id589665d5f5b8ad209e2f0e20a5fa827f"
            },
            "Dummy" : {
              "nodeId" : "MI5.Recipe[2].UserParameter[4].Dummy",
              "value" : true,
              "submitEvent" : "submitEvMI5.Recipe[2].UserParameter[4].Dummy",
              "updateEvent" : "updateEvMI5.Recipe[2].UserParameter[4].Dummy",
              "containerId" : "id9d07cb96258e4d013f100f90761127a0"
            },
            "MaxValue" : {
              "nodeId" : "MI5.Recipe[2].UserParameter[4].MaxValue",
              "value" : 0,
              "submitEvent" : "submitEvMI5.Recipe[2].UserParameter[4].MaxValue",
              "updateEvent" : "updateEvMI5.Recipe[2].UserParameter[4].MaxValue",
              "containerId" : "id31388e434dac0514cf95ee06b37d718b"
            },
            "MinValue" : {
              "nodeId" : "MI5.Recipe[2].UserParameter[4].MinValue",
              "value" : 0,
              "submitEvent" : "submitEvMI5.Recipe[2].UserParameter[4].MinValue",
              "updateEvent" : "updateEvMI5.Recipe[2].UserParameter[4].MinValue",
              "containerId" : "idc145daf5081379c296342729544043e0"
            },
            "Name" : {
              "nodeId" : "MI5.Recipe[2].UserParameter[4].Name",
              "value" : "",
              "submitEvent" : "submitEvMI5.Recipe[2].UserParameter[4].Name",
              "updateEvent" : "updateEvMI5.Recipe[2].UserParameter[4].Name",
              "containerId" : "idf1907e367313809ee582b377cbf91b85"
            },
            "Step" : {
              "nodeId" : "MI5.Recipe[2].UserParameter[4].Step",
              "value" : 0,
              "submitEvent" : "submitEvMI5.Recipe[2].UserParameter[4].Step",
              "updateEvent" : "updateEvMI5.Recipe[2].UserParameter[4].Step",
              "containerId" : "id6b30b6179b434c03112ca07a90ff5507"
            },
            "Unit" : {
              "nodeId" : "MI5.Recipe[2].UserParameter[4].Unit",
              "value" : "",
              "submitEvent" : "submitEvMI5.Recipe[2].UserParameter[4].Unit",
              "updateEvent" : "updateEvMI5.Recipe[2].UserParameter[4].Unit",
              "containerId" : "idcc9aabc2df35bdbd9cc4469d7fc9c4c8"
            }
          }, {
            "Default" : {
              "nodeId" : "MI5.Recipe[2].UserParameter[5].Default",
              "value" : 0,
              "submitEvent" : "submitEvMI5.Recipe[2].UserParameter[5].Default",
              "updateEvent" : "updateEvMI5.Recipe[2].UserParameter[5].Default",
              "containerId" : "ida36321de14956644dd9c96d78df69d42"
            },
            "Description" : {
              "nodeId" : "MI5.Recipe[2].UserParameter[5].Description",
              "value" : "",
              "submitEvent" : "submitEvMI5.Recipe[2].UserParameter[5].Description",
              "updateEvent" : "updateEvMI5.Recipe[2].UserParameter[5].Description",
              "containerId" : "id5653bc057e89df69e7f4b89c3a78d60a"
            },
            "Dummy" : {
              "nodeId" : "MI5.Recipe[2].UserParameter[5].Dummy",
              "value" : true,
              "submitEvent" : "submitEvMI5.Recipe[2].UserParameter[5].Dummy",
              "updateEvent" : "updateEvMI5.Recipe[2].UserParameter[5].Dummy",
              "containerId" : "id33cb5667f2960f0955b1d71083d3f51a"
            },
            "MaxValue" : {
              "nodeId" : "MI5.Recipe[2].UserParameter[5].MaxValue",
              "value" : 0,
              "submitEvent" : "submitEvMI5.Recipe[2].UserParameter[5].MaxValue",
              "updateEvent" : "updateEvMI5.Recipe[2].UserParameter[5].MaxValue",
              "containerId" : "id505d34f27371edaaaf3d6f883c249e50"
            },
            "MinValue" : {
              "nodeId" : "MI5.Recipe[2].UserParameter[5].MinValue",
              "value" : 0,
              "submitEvent" : "submitEvMI5.Recipe[2].UserParameter[5].MinValue",
              "updateEvent" : "updateEvMI5.Recipe[2].UserParameter[5].MinValue",
              "containerId" : "ida78ff06325ee46b6c8f3803bcfdf7bbe"
            },
            "Name" : {
              "nodeId" : "MI5.Recipe[2].UserParameter[5].Name",
              "value" : "",
              "submitEvent" : "submitEvMI5.Recipe[2].UserParameter[5].Name",
              "updateEvent" : "updateEvMI5.Recipe[2].UserParameter[5].Name",
              "containerId" : "id6438e36d85803c8c11ff31ee6ca7ae0f"
            },
            "Step" : {
              "nodeId" : "MI5.Recipe[2].UserParameter[5].Step",
              "value" : 0,
              "submitEvent" : "submitEvMI5.Recipe[2].UserParameter[5].Step",
              "updateEvent" : "updateEvMI5.Recipe[2].UserParameter[5].Step",
              "containerId" : "ide04e5238f7a7d48dfac87b0cf20e5b4e"
            },
            "Unit" : {
              "nodeId" : "MI5.Recipe[2].UserParameter[5].Unit",
              "value" : "",
              "submitEvent" : "submitEvMI5.Recipe[2].UserParameter[5].Unit",
              "updateEvent" : "updateEvMI5.Recipe[2].UserParameter[5].Unit",
              "containerId" : "idaad3fea452178030d37d4658d9c8b2db"
            }
          } ]
        } ]
  };
  res.render('bootstrap/testRecipeView', jadeData);
}