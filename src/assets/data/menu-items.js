export const MENU_ITEMS = [{
  key: 'general',
  label: 'GENERAL',
  isTitle: true
}, {
  key: 'dashboard',
  label: 'Dashboard',
  icon: 'solar:widget-5-bold-duotone',
  url: '/dashboard'
},
{
  key: 'menu-manager',
  label: 'Menu Manager',
  icon: 'solar:clipboard-list-bold-duotone',
  url: '/dashboard/menu-manager'
},
{
  key: "notifications",
  label: "Notifications",
  url: "/notifications",
  icon: "bx:bell"
},
//  {
//   key: 'products',
//   label: 'Products',
//   icon: 'solar:t-shirt-bold-duotone',
//   children: [{
//     key: 'product-list',
//     label: 'List',
//     url: '/products/product-list',
//     parentKey: 'products'
//   }, {
//     key: 'product-grid',
//     label: 'Grid',
//     url: '/products/product-grid',
//     parentKey: 'products'
//   }, {
//     key: 'product-details',
//     label: 'Details',
//     url: '/products/1',
//     parentKey: 'products'
//   }, {
//     key: 'product-edit',
//     label: 'Edit',
//     url: '/products/product-edit',
//     parentKey: 'products'
//   }, {
//     key: 'product-add',
//     label: 'Create',
//     url: '/products/product-add',
//     parentKey: 'products'
//   }]
// }, 
{
  key: 'meal',
  icon: 'solar:clipboard-list-bold-duotone',
  label: 'Meal item',
  children: [{
    key: 'meal-list',
    label: 'List',
    url: '/meal/meal-list',
    parentKey: 'meal'
  }, 
  // {
  //   key: 'meal-edit',
  //   label: 'Edit',
  //   url: '/meal/meal-edit',
  //   parentKey: 'meal'
  // }, 
  {
    key: 'meal-add',
    label: 'Create',
    url: '/meal/meal-add',
    parentKey: 'meal'
  }]
},{
  key: 'sideitem',
  icon: 'solar:cup-hot-bold-duotone',
  label: 'Add on',
  children: [{
    key: 'sideitem-list',
    label: 'List',
    url: '/sideitem/sideitem-list',
    parentKey: 'sideitem'
  }, {
    key: 'sideitem-add',
    label: 'Create',
    url: '/sideitem/sideitem-add',
    parentKey: 'sideitem'
  }]
},{
  key: 'subji',
  icon: 'solar:clipboard-list-bold-duotone',
  label: 'sabji',
  children: [{
    key: 'subji-list',
    label: 'List',
    url: '/subji/subji-list',
    parentKey: 'subji'
  }, 
  // {
  //   key: 'subji-edit',
  //   label: 'Edit',
  //   url: '/subji/subji-edit',
  //   parentKey: 'subji'
  // },
   {
    key: 'subji-add',
    label: 'Create',
    url: '/subji/subji-add',
    parentKey: 'subji'
  }
]
},{
  key: 'otheritem',
  icon: 'solar:clipboard-list-bold-duotone',
  label: 'Rice Section',
  children: [{
    key: 'otheritem-list',
    label: 'List',
    url: '/otheritem/otheritem-list',
    parentKey: 'otheritem'
  }, 
  // {
  //   key: 'bread-edit',
  //   label: 'Edit',
  //   url: '/bread/bread-edit',
  //   parentKey: 'bread'
  // }, 
  {
    key: 'otheritem-add',
    label: 'Create',
    url: '/otheritem/otheritem-add',
    parentKey: 'otheritem'
  }]
},{
  key: 'bread',
  icon: 'solar:clipboard-list-bold-duotone',
  label: 'bread',
  children: [{
    key: 'bread-list',
    label: 'List',
    url: '/bread/bread-list',
    parentKey: 'bread'
  }, 
  // {
  //   key: 'bread-edit',
  //   label: 'Edit',
  //   url: '/bread/bread-edit',
  //   parentKey: 'bread'
  // }, 
  {
    key: 'bread-add',
    label: 'Create',
    url: '/bread/bread-add',
    parentKey: 'bread'
  }]
}, 
// {
//   key: 'spacialitem',
//   icon: 'solar:clipboard-list-bold-duotone',
//   label: 'spacial item',
//   children: [{
//     key: 'spacialitem-list',
//     label: 'List',
//     url: '/spacialitem/spacialitem-list',
//     parentKey: 'spacialitem'
//   }, 
//   // {
//   //   key: 'bread-edit',
//   //   label: 'Edit',
//   //   url: '/bread/bread-edit',
//   //   parentKey: 'bread'
//   // }, 
//   {
//     key: 'spacialitem-add',
//     label: 'Create',
//     url: '/spacialitem/spacialitem-add',
//     parentKey: 'spacialitem'
//   }]
// }, 
{
  key: 'orders',
  label: 'Orders',
  icon: 'solar:bag-smile-bold-duotone',
  children: [{
    key: 'orders-list',
    label: 'List',
    url: '/orders/orders-list',
    parentKey: 'orders'
  }
  // ,{
  //   key: 'order-detail',
  //   label: 'Detail',
  //   url: '/orders/order-detail',
  //   parentKey: 'orders'
  // }
]
}, {
  key: 'users',
  label: 'USERS',
  isTitle: true
},  {
  key: 'customer',
  label: 'Customers',
  icon: 'solar:users-group-two-rounded-bold-duotone',
  children: [{
    key: 'customer-list',
    label: 'List',
    url: '/customer/customer-list',
    parentKey: 'customer'
  }
  // , {
  //   key: 'customer-detail',
  //   label: 'Details',
  //   url: '/customer/customer-detail',
  //   parentKey: 'customer'
  // }
]

},{
  key: 'delivery',
  icon: 'solar:streets-map-point-bold-duotone',
  label: 'Delivery',
  children: [
    {
      key: 'delivery-boy-list',
      label: 'Delivery Boys',
      url: '/delivery/delivery-boy-list',
      parentKey: 'delivery'
    },
    {
      key: 'delivery-zone',
      label: 'Delivery Zones',
      url: '/delivery/delivery-zone',
      parentKey: 'delivery'
    }
  ]
}
, {
  key: 'OTHER',
  label: 'OTHER',
  isTitle: true
}, {
  key: 'review',
  label: 'Review',
  icon: 'solar:chat-square-like-bold-duotone',
  url: '/review'
}, {
  key: 'support',
  label: 'SUPPORT',
  isTitle: true
}, {
  key: 'faqs',
  label: 'FAQs',
  icon: 'solar:question-circle-bold-duotone',
  url: '/support/faqs'
}, {
  key: 'privacy-policy',
  label: 'Privacy Policy',
  icon: 'solar:document-text-bold-duotone',
  url: '/support/privacy-policy'
},];