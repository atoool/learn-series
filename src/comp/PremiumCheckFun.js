import {Platform} from 'react-native';
import * as RNIap from 'react-native-iap';
import R from '../res/R';

const IAPid =
  Platform.OS === 'ios'
    ? ['walking.workout.premium.iap']
    : ['lifetime_iap_ios2'];
const subscriptionsID =
  Platform.OS === 'ios'
    ? [R.strings.subscription]
    : ['6month_premium_ios_2', 'monthly_premium_ios2'];
let premiumPurchased = false;
let price = 0;
let purchaseErrorSubscription = null;
let purchaseUpdateSubscription = null;
export const checkPurchased = async () => {
  await RNIap.getAvailablePurchases()
    .then(purchase => {
      let purchased = purchase !== 0 ? purchase[0].productId : null;
      if (
        purchased === IAPid[0] ||
        purchased === subscriptionsID[0] ||
        purchased === subscriptionsID[1]
      ) {
        premiumPurchased = true;
      } else {
        premiumPurchased = false;
      }
      console.warn(purchased);
    })
    .catch(() => {});

  return premiumPurchased;
};

export const showPrice = async () => {
  let sixMonthPrice;
  let monthlyPremium;
  try {
    await RNIap.getProducts(IAPid).then(products => {
      if (products.length > 0) {
        price = products[products.length - 1].localizedPrice;
      }
    });
    await RNIap.getSubscriptions(subscriptionsID).then(prices => {
      monthlyPremium = prices[1].localizedPrice;
      sixMonthPrice = prices[0].localizedPrice;
    });
  } catch (e) {
    console.warn(e);
  }
  return [price, sixMonthPrice, monthlyPremium];
};

export const purchasePremium = async () => {
  await RNIap.requestPurchase(IAPid[0], false).catch(() => {});
};
export const purchaseListener = that => {
  try {
    if (purchaseErrorSubscription == null) {
      try {
        purchaseErrorSubscription = RNIap.purchaseErrorListener(() => {});
      } catch (e) {}
    }
    if (purchaseUpdateSubscription == null) {
      purchaseUpdateSubscription = RNIap.purchaseUpdatedListener(
        async purchase => {
          const receipt = purchase.transactionReceipt;
          if (receipt) {
            that.setState({purchasedPremium: 'yup'}, () => {});
            try {
              await RNIap.finishTransaction(purchase, false).then(async () => {
                that.setState({purchasedPremium: 'success'}, () => {});
              });
            } catch (ackErr) {}
          }
        },
      );
    }
  } catch (e) {}
};

export const purchaseListenerRemove = () => {
  if (purchaseUpdateSubscription != null) {
    purchaseUpdateSubscription.remove();
    purchaseUpdateSubscription = null;
  }
  if (purchaseErrorSubscription != null) {
    purchaseErrorSubscription.remove();
    purchaseErrorSubscription = null;
  }
};

export const purchaseSixMonthSubs = async () => {
  await RNIap.requestSubscription(subscriptionsID[0], false).catch(() => {});
};

export const purchaseMonthlySubs = async () => {
  await RNIap.requestSubscription(subscriptionsID[1], false).catch(() => {});
};
