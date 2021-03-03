export const initialState = {
  campaign: null,
  referrerAcquisitionData: {
    queryParameters: [],
  },
  otherQueryParams: [],
  internationalisation: {
    countryGroupId: 'GBPCountries',
    countryId: 'GB',
    currencyId: 'GBP',
  },
  abParticipations: {},
  settings: {
    switches: {
      oneOffPaymentMethods: {
        stripe: 'On',
        stripeApplePay: 'On',
        stripePaymentRequestButton: 'On',
        payPal: 'On',
        amazonPay: 'On',
      },
      recurringPaymentMethods: {
        stripe: 'On',
        stripeApplePay: 'On',
        stripePaymentRequestButton: 'On',
        payPal: 'On',
        directDebit: 'On',
        existingCard: 'On',
        existingDirectDebit: 'On',
      },
      enableDigitalSubGifting: 'On',
      useDotcomContactPage: 'On',
      enableRecaptchaBackend: 'On',
      enableRecaptchaFrontend: 'On',
      experiments: {
        stripeElementsRecurring: {
          name: 'stripeElementsRecurring',
          description: 'Enable Stripe Elements test for Recurring Contributions',
          state: 'On',
        },
        recurringStripePaymentRequestButton: {
          name: 'recurringStripePaymentRequestButton',
          description: 'Enable Payment Requests button for Recurring Contributions',
          state: 'On',
        },
        newFlow: {
          name: 'newFlow',
          description: 'Redesign of the payment flow UI',
          state: 'On',
        },
        usStripeAccountForSingle: {
          name: 'usStripeAccountForSingle',
          description: 'Enable US Stripe Account for Single Contributions',
          state: 'On',
        },
        checkoutPostcodeLookup: {
          name: 'checkoutPostcodeLookup',
          description: 'Enable external service postcode lookup in checkout form',
          state: 'Off',
        },
        paperHomeDeliveryEnabled: {
          name: 'paperHomeDeliveryEnabled',
          description: 'Enable HD option for paper subs',
          state: 'On',
        },
      },
      enableContributionsCampaign: 'On',
      forceContributionsCampaign: 'Off',
    },
    amounts: {
      GBPCountries: {
        control: {
          ONE_OFF: {
            amounts: [5, 10, 15, 45],
            defaultAmount: 10,
          },
          MONTHLY: {
            amounts: [5, 10, 15, 20],
            defaultAmount: 20,
          },
          ANNUAL: {
            amounts: [5, 10, 15, 20],
            defaultAmount: 15,
          },
        },
        test: {
          name: 'GBP_COUNTRIES_AMOUNTS_TEST',
          isLive: true,
          variants: [{
            name: 'V1',
            amounts: {
              ONE_OFF: {
                amounts: [5, 10, 20, 25, 30],
                defaultAmount: 20,
              },
              MONTHLY: {
                amounts: [5, 15, 30, 40, 80],
                defaultAmount: 15,
              },
              ANNUAL: {
                amounts: [100, 150, 250, 500],
                defaultAmount: 250,
              },
            },
          }, {
            name: 'V2',
            amounts: {
              ONE_OFF: {
                amounts: [10, 50, 100, 150],
                defaultAmount: 100,
              },
              MONTHLY: {
                amounts: [10, 20, 40, 50],
                defaultAmount: 50,
              },
              ANNUAL: {
                amounts: [150, 300, 500, 750],
                defaultAmount: 500,
              },
            },
          }],
          seed: 398375,
        },
      },
      UnitedStates: {
        control: {
          ONE_OFF: {
            amounts: [5, 10, 15, 20],
            defaultAmount: 5,
          },
          MONTHLY: {
            amounts: [5, 10, 15, 20],
            defaultAmount: 5,
          },
          ANNUAL: {
            amounts: [5, 10, 15, 20],
            defaultAmount: 5,
          },
        },
      },
      EURCountries: {
        control: {
          ONE_OFF: {
            amounts: [5, 10, 15, 20],
            defaultAmount: 5,
          },
          MONTHLY: {
            amounts: [5, 10, 15, 20],
            defaultAmount: 5,
          },
          ANNUAL: {
            amounts: [5, 10, 15, 20],
            defaultAmount: 5,
          },
        },
      },
      AUDCountries: {
        control: {
          ONE_OFF: {
            amounts: [5, 10, 15, 20],
            defaultAmount: 5,
          },
          MONTHLY: {
            amounts: [5, 10, 15, 20],
            defaultAmount: 5,
          },
          ANNUAL: {
            amounts: [5, 10, 15, 20],
            defaultAmount: 5,
          },
        },
      },
      International: {
        control: {
          ONE_OFF: {
            amounts: [5, 10, 15, 20],
            defaultAmount: 5,
          },
          MONTHLY: {
            amounts: [5, 10, 15, 20],
            defaultAmount: 5,
          },
          ANNUAL: {
            amounts: [5, 10, 15, 20],
            defaultAmount: 5,
          },
        },
      },
      NZDCountries: {
        control: {
          ONE_OFF: {
            amounts: [5, 10, 15, 20],
            defaultAmount: 5,
          },
          MONTHLY: {
            amounts: [5, 10, 15, 20],
            defaultAmount: 5,
          },
          ANNUAL: {
            amounts: [5, 10, 15, 20],
            defaultAmount: 5,
          },
        },
      },
      Canada: {
        control: {
          ONE_OFF: {
            amounts: [5, 10, 15, 20],
            defaultAmount: 5,
          },
          MONTHLY: {
            amounts: [5, 10, 15, 20],
            defaultAmount: 5,
          },
          ANNUAL: {
            amounts: [5, 10, 15, 20],
            defaultAmount: 5,
          },
        },
      },
    },
    contributionTypes: {
      GBPCountries: [{
        contributionType: 'ONE_OFF',
      }, {
        contributionType: 'MONTHLY',
        isDefault: true,
      }, {
        contributionType: 'ANNUAL',
      }],
      UnitedStates: [{
        contributionType: 'ONE_OFF',
      }, {
        contributionType: 'MONTHLY',
        isDefault: true,
      }, {
        contributionType: 'ANNUAL',
      }],
      EURCountries: [{
        contributionType: 'ONE_OFF',
      }, {
        contributionType: 'MONTHLY',
        isDefault: true,
      }, {
        contributionType: 'ANNUAL',
      }],
      International: [{
        contributionType: 'ONE_OFF',
      }, {
        contributionType: 'MONTHLY',
        isDefault: true,
      }, {
        contributionType: 'ANNUAL',
      }],
      Canada: [{
        contributionType: 'ONE_OFF',
      }, {
        contributionType: 'MONTHLY',
        isDefault: true,
      }, {
        contributionType: 'ANNUAL',
      }],
      AUDCountries: [{
        contributionType: 'ONE_OFF',
      }, {
        contributionType: 'MONTHLY',
        isDefault: true,
      }, {
        contributionType: 'ANNUAL',
      }],
      NZDCountries: [{
        contributionType: 'ONE_OFF',
      }, {
        contributionType: 'MONTHLY',
        isDefault: true,
      }, {
        contributionType: 'ANNUAL',
      }],
    },
    metricUrl: 'https://metric-push-api-code.support.guardianapis.com/metric-push-api',
    useDigitalVoucher: null,
  },
  amounts: {
    ONE_OFF: {
      amounts: [5, 10, 15, 45],
      defaultAmount: 10,
    },
    MONTHLY: {
      amounts: [5, 10, 15, 20],
      defaultAmount: 20,
    },
    ANNUAL: {
      amounts: [5, 10, 15, 20],
      defaultAmount: 15,
    },
  },
};
