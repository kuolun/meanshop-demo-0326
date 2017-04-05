module.exports = function (app, passport) {

  //model
  var Category = require('./models/category');

  var Product = require('./models/product');

  //取得user model
  var User = require('./models/user');


  // Stripe secret Key
  var Stripe = require('stripe')('sk_test_ZPTLcTtpDPvz3ZNkLt707GU4');


  //localhost:3000/api/productName
  app.get('/about', function (req, res) {
    console.log(req.session);
    res.send('my about page');
  });

  app.post('/addCategory', function (req, res) {
    var category = new Category();
    category.name = req.body.name;

    category.save(function (err, category) {
      res.json({
        category: category
      });
    });
  });

  // 取得所有產品分類
  app.get('/categories/all', function (req, res) {
    Category.find({}, function (error, categories) {
      if (error) {
        return res.
          status(status.INTERNAL_SERVER_ERROR).
          json({
            error: error.toString()
          });
      }
      console.log("categories got!");
      res.json({
        categories: categories
      });
    });
  });

  //用category id取得對應products
  app.get('/products/:id', function (req, res, next) {
    Product
      .find({
        category: req.params.id
      })
      // 將category path替換成對應的資料
      .populate('category')
      .exec(function (err, products) {
        if (err) return next(err);
        // 取到資料就回傳json
        res.json({
          products: products
        });
      });
  });

  //取得所有product
  app.get('/productsall/', function (req, res) {
    //空{}代表傳回Category下所有document
    Product.find({})
      .populate('category')
      .exec(function (error, products) {
        if (error) {
          return res.status(500).
            json({
              error: error.toString()
            });
        }
        res.json({
          products: products
        });
        // res.json(products);
      });
  });

  // 用product_id找product
  app.get('/product/:id', function (req, res) {
    Product.findById({
      _id: req.params.id
    }, function (err, product) {
      if (err) return next(err);
      //回傳json
      res.json({
        product: product
      });
    })
  });



  //取出User的Cart資料 (for <cart>)
  app.get('/cart/:email', function (req, res, next) {
    User.findOne({
      email: req.params.email
    })
      //因為product的type為ObjectId所以要populate
      .populate('data.cart.product')
      .exec(function (err, user) {
        console.log(user);
        if (err) return next(err);
        res.json({
          cart: user.data.cart
        });
      });
  });

  // 載入User資料
  app.get('/user/:email', function (req, res, next) {
    User.findOne({
      email: req.params.email
    })
      //因為product的type為ObjectId所以要populate
      .populate('data.cart.product')
      .exec(function (err, user) {
        console.log('user in DB:', user);
        if (err) return next(err);
        res.json({
          loadedUser: user
        });
      });
  });


  // 更新購物車內容
  app.put('/updateCart', function (req, res, next) {
    User.findOne({
      email: req.body.email
    }, function (err, foundUser) {
      foundUser.data.cart = req.body.newCart;
      foundUser.data.totalValue = req.body.newTotal;
      foundUser.save(function (err, savedUser) {
        if (err) return next(err);
        // 回傳save後的user
        return res.json({
          savedUser: savedUser
        });
      });
    });
  });

  app.put('/remove', function (req, res, next) {
    User.findOne({
      email: req.body.email
    }, function (err, foundUser) {
      console.log('foundUser:', foundUser);
      console.log('body.updatedItem:', req.body.updatedItem);
      // 用傳入的updatedItem.cart把原本的cart換掉
      // 總金額也更新
      foundUser.data.cart = req.body.updatedItem.cart;
      foundUser.data.totalValue = req.body.updatedItem.totalValue;
      foundUser.save(function (err, savedUser) {
        console.log('save');
        if (err) return next(err);
        res.json(savedUser);
      });
    });
  });


  /**
   * Stripe結帳
   */

  app.post('/stripepayment', function (req, res) {
    let user = req.body.user;

    console.log('post incomming');
    console.log('reg:', req.body)
    console.log('current user:', user);


    //建立user資料
    Stripe.customers.create({
      email: req.body.userEmail,
      source: req.body.tokenId//從前端傳入的tokenId
    })
      .then(customer =>//建立charge資料
        Stripe.charges.create({
          amount: Math.ceil(req.body.amount * 100),//Stripe的價格要用cents所以x100且四捨五入
          description: "Example charge from kuolun",
          currency: "usd",
          customer: customer.id
        }))
      .then(charge => {
        // res.json(charge)
        User.findOne({ email: user.email }, function (err, user) {
          // 清空DB購物車
          user.data.cart = [];
          user.data.totalValue = 0;
          user.save(function () {
            // 成功的話回傳id及狀態
            return res.json({
              id: charge.id,
              status: charge.status
            });
          });
        })
      });
  });





  /**
   * add new user from Auth0
   */
  app.post('/newUser', function (req, res, next) {
    var profile = req.body;
    //用email看是否user已存在DB
    User.findOne({
      email: profile.email
    }, function (err, user) {
      //如果有錯就回傳錯誤
      if (err) {
        console.log('DB error');
        throw err;
      }

      var newUser = new User();
      //profile是Auth0回傳的資訊
      newUser.clientID = profile.clientID;
      newUser.email = profile.email;
      newUser.profile.username = profile.name;
      newUser.profile.picture = profile.picture;
      //把新user存到DB
      newUser.save(function (err, user) {
        if (err) {
          console.log('save error');
          throw err;
        }
        return res.json({
          savedUser: user
        });
      });

    });
  });

  /**
   * check user in DB
   */
  app.get('/checkDBUser/:email', function (req, res, next) {
    User.findOne({
      email: req.params.email
    }, function (err, user) {
      if (err) return next(err);
      res.json({
        user: user
      });
    });
  });





  // app.get('*', function (req, res) {
  //   // res.send('Page Not found!');
  //   res.sendFile(path.join(__dirname, 'dist/index.html'));
  // });


};
