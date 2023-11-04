// const LocalStrategy = require("passport-local").Strategy;
// const { pool } = require("./dbConfig");
// const bcrypt= require("bcrypt");

// function initialize(passport){
//     const authenticateUser = (email,password,done) => {
//         pool.query(
//             `SELECT * FROM patients WHERE email=$1`,
//             [email],
//             (err, results) => {
//                 if(err) {
//                     throw err;
//                 }
//                 console.log(results.rows);

//                 if(results.rows.length >0)
//                 {
//                     const user=results.rows[0];

//                     bcrypt.compare(password, user.password, (err, isMatch) => {
//                         if(err)
//                         {
//                             throw err;
//                         }

//                         if(isMatch) {
//                             return done(null, user); //the done function stores two parameters for error=null since no error and the user it will return the user and store it in a session cookie
//                         }else{
//                             return done(null,false,{message: "Password is not correct"});
//                         }
//                     });
//                 }else{ //this else if for if there are no users o for this email
//                     return done(null, false, {message: "Email Is Not Registered"});
//                 }
//             }
//         )
//     }
//     passport.use(new LocalStrategy({
//         usernameField: "email",
//         passwordField: "password",
//         ssl: true,
//     },
//     authenticateUser
//     ));

//     passport.serializeUser((user,done) =>done(null, user.id));//passport serializeuser stores the user id in the session cookie
//     passport.deserializeUser((id,done) => {   //uses the user id to take the user details from the database and store the full details in the session when we navigate between different pages
//         pool.query(
//             `SELECT * FROM patients WHERE id =$1`, [id], (err, results) => {
//                 if(err){
//                     throw err;
//                 }
//                 return done(null, results.rows[0]);
//             }
//         );
//     });
// }

// module.exports= initialize;


// const LocalStrategy = require("passport-local").Strategy;
// const { pool } = require("./dbConfig");
// const bcrypt = require("bcrypt");

// function initialize(passport) {
//   const authenticateUser = (email, password, done) => {
//     pool.query(
//       `SELECT * FROM patients WHERE email = $1`,
//       [email],
//       (err, results) => {
//         if (err) {
//           return done(err);
//         }

//         if (results.rows.length === 0) {
//           return done(null, false, { message: "Email Is Not Registered" });
//         }

//         const user = results.rows[0];

//         bcrypt.compare(password, user.password, (err, isMatch) => {
//           if (err) {
//             return done(err);
//           }

//           if (isMatch) {
//             return done(null, user);
//           } else {
//             return done(null, false, { message: "Password is not correct" });
//           }
//         });
//       }
//     );
//   }

//   passport.use(
//     new LocalStrategy(
//       {
//         usernameField: "email",
//         passwordField: "password",
//       },
//       authenticateUser
//     )
//   );

//   passport.serializeUser((user, done) => done(null, user.id));
//   passport.deserializeUser((id, done) => {
//     pool.query(
//       `SELECT * FROM patients WHERE id = $1`,
//       [id],
//       (err, results) => {
//         if (err) {
//           return done(err);
//         }
//         return done(null, results.rows[0]);
//       }
//     );
//   });
// }

// module.exports = initialize;



const LocalStrategy = require("passport-local").Strategy;
const { pool } = require("./dbConfig");
const bcrypt = require("bcrypt");

function initialize(passport) {
  const authenticateUser = (email, password, done) => {
    pool.query(
      `SELECT * FROM patients WHERE email = $1`,
      [email],
      (err, results) => {
        if (err) {
          return done(err);
        }

        if (results.rows.length === 0) {
          return done(null, false, { message: "Email Is Not Registered" });
        }

        const user = results.rows[0];

        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) {
            return done(err);
          }

          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Password is not correct" });
          }
        });
      }
    );
  }

  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      authenticateUser
    )
  );

  passport.serializeUser((user, done) => done(null, user.email));
  passport.deserializeUser((email, done) => {
    pool.query(
      `SELECT * FROM patients WHERE email = $1`,
      [email],
      (err, results) => {
        if (err) {
          return done(err);
        }
        return done(null, results.rows[0]);
      }
    );
  });
}

module.exports = initialize;

