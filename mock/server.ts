const dotenv = require('dotenv');
dotenv.config({
  path: 'mock/.env',
});
const { faker } = require('@faker-js/faker');
const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('mock/db.json');
const middlewares = jsonServer.defaults();
const rewriter = jsonServer.rewriter(require('./routes.json'));
const db = router.db
server.use(middlewares);

server.use(middlewares);
server.all('*',(req: { method: string; }, res: { setHeader: (arg0: string, arg1: string) => void; sendStatus: (arg0: number) => void; }, next: () => void)=>{
  if(req.method === "OPTIONS"){
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE")
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Origin, X-Requested-With, Accept, x-user, x-payment-auth, ngrok-skip-browser-warning")
    res.sendStatus(204)
  }else{
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE")
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Origin, X-Requested-With, Accept, x-user, x-payment-auth, ngrok-skip-browser-warning")
    next()
  }

})

server.use(jsonServer.bodyParser);
server.use(rewriter);
const jwt = require('jsonwebtoken');
const { isEmpty } = require("lodash")
import ngrok from 'ngrok';
import Stripe from 'stripe'
// @ts-ignore
const stripe = new Stripe(process.env.STRIPE_TEST_SECRET_KEY,{
  apiVersion: '2022-11-15',
});

server.use((req: any, res: { wrapResponse: boolean; }, next: () => void) => {
  res.wrapResponse = true;
  next();
});

const isSuccessStatus = (statusCode: number) => statusCode >= 200 && statusCode < 300;

router.render = (req: any, res: { wrapResponse: any; json: (arg0: { data: any; status: string; message: string; }) => void; locals: { data: any; }; statusCode: any; }) => {
  if (res.wrapResponse) {
    res.json({
      data: res.locals.data,
      status: isSuccessStatus(res.statusCode) ? 'success' : 'error',
      message: isSuccessStatus(res.statusCode) ? 'Success' : 'An error occurred',
    });
  } else {
    res.json(res.locals.data);
  }
};

server.get("/users", (req: { query: { user_id: any; handle: any; }; headers: { authorization: string; }; }, res: { json: (arg0: { data: any; status: string; message: string; }) => void; })=> {

    const requested_id = req.query.user_id
    const handle = req.query.handle
    if (handle){ 
      const user = db.get("users").find({handle}).value()
      res.json({
        data: !isEmpty(user),
        status: "success",
        message: "Success"
      })
    } else if (requested_id){
      const user = db.get("users").find({id: requested_id}).value()
      res.json({
        data: user,
        status: "success",
        message: "Success"
      })
    } else {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.decode(token);
      const uid = decoded.user_id;
      const exists = db.get("users").find({uid}).value()
      if(isEmpty(exists)){
        // replace the first host user's id with the new user's id
          const customer = db.get("users").find({user_type: "CUSTOMER"}).value()
          db.get("users").find({uid: customer.uid}).assign({uid}).write()
      } 
      res.json({
          data: db.get("users").find({uid}).value(),
          status: "success",
          message: "Success"
      })
    }

    
})

server.post("/users", (req: { headers: { authorization: string; }; body: any; }, res: { json: (arg0: { data: any; status: string; message: string; }) => void; })=>{
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.decode(token);
    const uid = decoded.user_id;
    const exists = db.get("users").find({uid}).value()
    if(isEmpty(exists)){
        // replace the first host user's id with the new user's id
        const customer = db.get("users").find({user_type: "CUSTOMER"}).value()
        db.get("users").find({uid: customer.uid}).assign({uid}).write()
    } else {
        db.get("users").find({uid}).assign(req.body).write()
    }
    res.json({
        data: db.get("users").find({uid}).value(),
        status: "success",
        message: "Success"
    })
})

server.patch("/users", (req: { headers: { authorization: string; }; body: any; }, res: { json: (arg0: { data: any; status: string; message: string; }) => void; })=>{
  const token = req?.headers?.authorization?.split(" ")[1];
    const decoded = jwt.decode(token);
    const uid = decoded?.user_id;
    const exists = db.get("users").find({uid}).value()
    if(isEmpty(exists)){
        // replace the first host user's id with the new user's id
        const customer = db.get("users").find({user_type: "CUSTOMER"}).value()
        db.get("users").find({uid: customer.uid}).assign({uid}).write()
        // get the user
        const user = db.get("users").find({uid}).value()
        // update the user
        db.get("users").find({uid}).assign(req.body).write()
    } else {
        db.get("users").find({uid}).assign(req.body).write()
    }
    res.json({
        data: db.get("users").find({uid}).value(),
        status: "success",
        message: "Successsss"
    })
})

server.get("/users/onboarding", (req: { headers: { authorization: string; }; }, res: { json: (arg0: { data: {}; status: string; message: string; }) => void; })=>{
  if(isEmpty(req.headers.authorization)) return res.json({
    data: {},
    status: "error",
    message: "No authorization header"
  })
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.decode(token);
  const uid = decoded.user_id;
  const exists = db.get("users").find({uid}).value()
  let onboarding = {}
  if(isEmpty(exists)){
      // replace the first customer user's id with the new user's id
      const customer = db.get("users").find({user_type: "CUSTOMER"}).value()
      db.get("users").find({uid: customer.uid}).assign({uid}).write()
      // get the user
      const user = db.get("users").find({uid}).value()
      // get onboarding detials
      onboarding = {
        completed: {
          location: false,
          payment_method: false,
          drivers_license: false,
        }
      }
  } else {
      const user = db.get("users").find({uid}).value()
      onboarding = {
        completed: {
          location: false,
          payment_method: false,
          drivers_license: false,
        }
      }
  }
    res.json({
      data: onboarding,
      status: "success",
      message: "Success"
    })
})

server.patch("/users/settings", (req: any, res: { json: (arg0: { data: string; message: string; status: string; }) => void; })=>{
  res.json({
    data: "",
    message: "Success",
    status: "success"
  })
})

server.post("/settings/tokens", (req: any, res: { json: (arg0: { data: string; message: string; status: string; }) => void; })=>{
  res.json({
    data: "",
    message: "Success",
    status: "success"
  })
})

server.post("/paymenttypes", (req: any, res: { json: (arg0: { data: string; message: string; status: string; }) => void; })=>{
  res.json({
    data: "",
    message: "Success",
    status: "success"
  })
})


server.post("/payments/mpesa", (req: any, res: { json: (arg0: { data: { authorization: string; status: string; }; status: string; message: string; }) => void; })=>{
    res.json({
        data: {
          authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiM2Q2ODZkOGEtYWI1Mi00NjI4LWFiOTYtODlmNWM1ZDlkM2NlIiwiYW1vdW50Ijo1MDAsInRpbWVzdGFtcCI6MTY4MjU4NDQyMjIwMywiaWF0IjoxNjgyNTg0NDIyfQ.y_FOKai5zfTNnj0PvYk8pjWpsC1ggvSQbeYtwK9H820",
          status: "PROCESSING",
        },
        status: "success",
        message: "Success"
    })
})

server.get("/payments/confirm", (req: any, res: { json: (arg0: { data: boolean; status: string; message: string; }) => void; })=>{
  /**
   * To simulate some delay in the payment confirmation
   */
  setTimeout(()=>{
    res.json({
      data: true, 
      status: "success",
      message: "Success"
    })
  })
})

server.post("/payments/mtn", (req: any, res: { json: (arg0: { data: { authorization: string; status: string; }; status: string; message: string; }) => void; })=>{
  res.json({
      data: {
        authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiM2Q2ODZkOGEtYWI1Mi00NjI4LWFiOTYtODlmNWM1ZDlkM2NlIiwiYW1vdW50Ijo1MDAsInRpbWVzdGFtcCI6MTY4MjU4NDQyMjIwMywiaWF0IjoxNjgyNTg0NDIyfQ.y_FOKai5zfTNnj0PvYk8pjWpsC1ggvSQbeYtwK9H820",
        status: "PROCESSING",
      },
      status: "success",
      message: "Success"
  })
})

server.post("/payments/stripe", async (req: any, res: {
    json: (arg0: {
      data: {
        ephemeralKey: string | undefined; authorization: string; status: string; id: string; object: "payment_intent"; amount: number; amount_capturable: number; amount_details?: Stripe.PaymentIntent.AmountDetails | undefined; amount_received: number; application: string | Stripe.Application | null; application_fee_amount: number | null; automatic_payment_methods: Stripe.PaymentIntent.AutomaticPaymentMethods | null; canceled_at: number | null; cancellation_reason: Stripe.PaymentIntent.CancellationReason | null; capture_method: Stripe.PaymentIntent.CaptureMethod; client_secret: string | null; confirmation_method: Stripe.PaymentIntent.ConfirmationMethod; created: number; currency: string; customer: string | Stripe.Customer | Stripe.DeletedCustomer | null; description: string | null; // get onboarding detials
        // get onboarding detials
        invoice: string | Stripe.Invoice | null; last_payment_error: Stripe.PaymentIntent.LastPaymentError | null; latest_charge?: string | Stripe.Charge | null | undefined; livemode: boolean; metadata: Stripe.Metadata; next_action: Stripe.PaymentIntent.NextAction | null; on_behalf_of: string | Stripe.Account | null; payment_method: string | Stripe.PaymentMethod | null; payment_method_options: Stripe.PaymentIntent.PaymentMethodOptions | null; payment_method_types: string[]; processing: Stripe.PaymentIntent.Processing | null; receipt_email: string | null; review: string | Stripe.Review | null; setup_future_usage: Stripe.PaymentIntent.SetupFutureUsage | null; shipping: Stripe.PaymentIntent.Shipping | null; source: string | Stripe.CustomerSource | Stripe.DeletedBankAccount | Stripe.DeletedCard | null; statement_descriptor: string | null; statement_descriptor_suffix: string | null; transfer_data: Stripe.PaymentIntent.TransferData | null; transfer_group: string | null; lastResponse: { headers: { [key: string]: string; }; requestId: string; statusCode: number; apiVersion?: string | undefined; idempotencyKey?: string | undefined; stripeAccount?: string | undefined; };
      }; status: string; message: string;
    }) => void;
  })=>{

  const ephemeralKey = await stripe.ephemeralKeys.create(
    {customer: "cus_NmL4gw2sAQ1QDV"},
    {apiVersion: "2022-11-15"}
  );

  const paymentIntent = await stripe.paymentIntents.create({
    amount: 100000,
    currency: req?.body?.currency ?? 'usd',
    confirm: true,
    payment_method_types: ['card'],
    payment_method: "pm_1N0mOhAoGqRfm1CGEcOo3ePk", // dummy payment method for testing
    customer: "cus_NmL4gw2sAQ1QDV",
  })


  res.json({
      data: {
        ...paymentIntent,
        ephemeralKey: ephemeralKey.secret,
        authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiM2Q2ODZkOGEtYWI1Mi00NjI4LWFiOTYtODlmNWM1ZDlkM2NlIiwiYW1vdW50Ijo1MDAsInRpbWVzdGFtcCI6MTY4MjU4NDQyMjIwMywiaWF0IjoxNjgyNTg0NDIyfQ.y_FOKai5zfTNnj0PvYk8pjWpsC1ggvSQbeYtwK9H820",
        status: "PROCESSING",
      },
      status: "success",
      message: "Success"
  })
})

server.use(router);

if(!process.env.NGROK_AUTH_TOKEN){
  console.log(`
      ❗❗ IMPORTANT ❗❗
      You need to set the NGROK_AUTH_TOKEN environment variable if u are using code spaces if not 
      ignore this message
  `)
}else{
  ngrok.authtoken(process.env.NGROK_AUTH_TOKEN)
  ngrok.connect(3003).then((url)=>{
    console.log(`
     ❗❗ IMPORTANT ❗❗
      Running the mock server means you are in test mode:
      
      COPY THIS URL: ${url}
      AND PASTE IT IN THE .env(the one in the root) file as the value for the **API_URL** variable
      
      the requests made by the client will not work if you don't do this
  
      ❗Don't commit the .env file to git
    `)
  })
}

server.listen(3003, () => {
  console.log('JSON Server is running on port 3003');
});
