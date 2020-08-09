import {Platform, Alert} from 'react-native';
import * as RNIap from 'react-native-iap';
import R from '../res/R';

const IAPid =
  Platform.OS === 'ios' ? ['walking.workout.premium.iap'] : ['lifetime_iap'];
const subscriptionsID =
  Platform.OS === 'ios'
    ? [R.strings.subscription]
    : ['android.test.purchased', 'monthly_premium'];
let premiumPurchased;
let price;
let microPrice;
let purchaseErrorSubscription = null;
let purchaseUpdateSubscription = null;
checkPurchased = async () => {
  await RNIap.getAvailablePurchases()
    .then(purchase => {
      let purchased = purchase != 0 ? purchase[0].productId : null;
      if (
        // purchased === IAPid[0] ||
        purchased === subscriptionsID[0]
        // ||
        // purchased === subscriptionsID[1]
      ) {
        premiumPurchased = true;
      } else {
        premiumPurchased = false;
      }
    })
    .catch(err => {});

  return premiumPurchased;
};
showPrice = async () => {
  let sixMonthPrice;
  let monthlyPremium;
  // await RNIap.getProducts(IAPid)
  //   .then(products => {
  //     if (products.length > 0) {
  //       price = products[products.length - 1].localizedPrice;
  //     }
  //   })
  //   .catch(err => {});
  await RNIap.getSubscriptions(subscriptionsID)
    .then(prices => {
      // monthlyPremium = prices[1].localizedPrice;
      sixMonthPrice = prices[0].localizedPrice;
    })
    .catch(err => {});
  // return [price, sixMonthPrice, monthlyPremium];
  return [0, sixMonthPrice, 0];
};

purchasePremium = async () => {
  await RNIap.requestPurchase(IAPid[0], false).catch(err => {});
};
purchaseListener = that => {
  try {
    if (purchaseErrorSubscription == null) {
      try {
        purchaseErrorSubscription = RNIap.purchaseErrorListener(error => {
          Alert.alert(error.message);
        });
      } catch (e) {}
    }
    if (purchaseUpdateSubscription == null) {
      purchaseUpdateSubscription = RNIap.purchaseUpdatedListener(
        async purchase => {
          console.warn('purchase');

          const receipt = purchase.transactionReceipt;
          if (receipt) {
            console.warn('recep');

            that.setState({purchasedPremium: 'yup'}, () => {
              console.warn('yup');
            });
            try {
              console.warn('onsuc');

              await RNIap.finishTransaction(purchase, false).then(async () => {
                that.setState({purchasedPremium: 'success'}, () => {
                  console.warn('suc');
                });
              });
            } catch (ackErr) {
              console.warn('ee');
            }
          } else {
            console.warn('ww');
          }
        },
      );
    }
  } catch (e) {
    console.warn('kkk');
  }
};

purchaseListenerRemove = () => {
  if (purchaseUpdateSubscription != null) {
    purchaseUpdateSubscription.remove();
    purchaseUpdateSubscription = null;
  }
  if (purchaseErrorSubscription != null) {
    purchaseErrorSubscription.remove();
    purchaseErrorSubscription = null;
  }
};

purchaseSixMonthSubs = async () => {
  await RNIap.requestSubscription(subscriptionsID[0], false).catch(err => {});
};

purchaseMonthlySubs = async () => {
  await RNIap.requestSubscription(subscriptionsID[1], false).catch(err => {});
};

export default {
  checkPurchased,
  showPrice,
  purchasePremium,
  purchaseMonthlySubs,
  purchaseSixMonthSubs,
  purchaseListener,
  purchaseListenerRemove,
};
