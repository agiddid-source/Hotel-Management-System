// Mock data store (localStorage-backed) for HotelMS modules
(function(){
  const KEY_G='hms_guests', KEY_I='hms_inventory', KEY_P='hms_payments';

  const seedGuests = [
    {id:'G-1042',name:'Amara Okafor',email:'amara.okafor@email.com',phone:'+234 803 555 0114',address:'12 Marina Rd, Lagos',room:'304',checkIn:'2026-06-12',checkOut:'2026-06-16',status:'Checked-in',vip:true,stays:7,lifetimeValue:1840000,notes:'Allergic to peanuts. Prefers high floor, late checkout.',requests:['Extra pillows','Late checkout 2pm'],history:[{id:'B-901',room:'212',in:'2025-12-04',out:'2025-12-08',amount:420000},{id:'B-877',room:'410',in:'2025-08-19',out:'2025-08-22',amount:315000}]},
    {id:'G-1043',name:'David Mensah',email:'d.mensah@email.com',phone:'+233 244 100 882',address:'East Legon, Accra',room:'118',checkIn:'2026-06-14',checkOut:'2026-06-15',status:'Checked-in',vip:false,stays:2,lifetimeValue:280000,notes:'',requests:['Quiet room'],history:[{id:'B-812',room:'120',in:'2025-09-02',out:'2025-09-04',amount:155000}]},
    {id:'G-1044',name:'Sofia Albright',email:'sofia.a@email.com',phone:'+44 7700 900 121',address:'Notting Hill, London',room:'—',checkIn:'2026-06-18',checkOut:'2026-06-22',status:'Reserved',vip:false,stays:1,lifetimeValue:0,notes:'First time guest. Honeymoon stay.',requests:['Champagne on arrival','Rose petals'],history:[]},
    {id:'G-1045',name:'Tunde Bakare',email:'tunde.b@email.com',phone:'+234 802 444 7711',address:'Ikoyi, Lagos',room:'—',checkIn:'2026-06-08',checkOut:'2026-06-11',status:'Checked-out',vip:false,stays:4,lifetimeValue:670000,notes:'Complained about WiFi on last stay — resolved.',requests:[],history:[{id:'B-790',room:'201',in:'2026-06-08',out:'2026-06-11',amount:240000}]},
    {id:'G-1046',name:'Liu Wei',email:'liu.wei@email.com',phone:'+86 138 0013 8000',address:'Pudong, Shanghai',room:'507',checkIn:'2026-06-13',checkOut:'2026-06-17',status:'Checked-in',vip:true,stays:11,lifetimeValue:2950000,notes:'Repeat business guest. Prefers room 507.',requests:['Iron & board','Daily newspaper'],history:[]},
    {id:'G-1047',name:'Fatima Salisu',email:'fatima.s@email.com',phone:'+234 706 222 0099',address:'Wuse 2, Abuja',room:'—',checkIn:'2026-06-20',checkOut:'2026-06-24',status:'Reserved',vip:false,stays:3,lifetimeValue:510000,notes:'',requests:['Halal breakfast'],history:[]},
    {id:'G-1048',name:'James O\u2019Connor',email:'james.oc@email.com',phone:'+353 86 555 7711',address:'Dublin, Ireland',room:'—',checkIn:'2026-05-30',checkOut:'2026-06-02',status:'Checked-out',vip:false,stays:1,lifetimeValue:185000,notes:'',requests:[],history:[]},
    {id:'G-1049',name:'Priya Raman',email:'priya.r@email.com',phone:'+91 98765 43210',address:'Bandra, Mumbai',room:'221',checkIn:'2026-06-14',checkOut:'2026-06-19',status:'Checked-in',vip:false,stays:2,lifetimeValue:330000,notes:'Vegetarian meals only.',requests:['Vegetarian breakfast'],history:[]}
  ];

  const seedInventory = [
    {id:'I-001',name:'Bath Towels (White)',category:'Linen',quantity:240,reorder:80,supplier:'Premium Linen Co.',updated:'2026-06-12'},
    {id:'I-002',name:'Bed Sheets (Queen)',category:'Linen',quantity:62,reorder:80,supplier:'Premium Linen Co.',updated:'2026-06-13'},
    {id:'I-003',name:'Pillow Cases',category:'Linen',quantity:0,reorder:60,supplier:'Premium Linen Co.',updated:'2026-06-10'},
    {id:'I-004',name:'Hand Soap (250ml)',category:'Toiletries',quantity:180,reorder:60,supplier:'AromaCare',updated:'2026-06-13'},
    {id:'I-005',name:'Shampoo Bottles',category:'Toiletries',quantity:45,reorder:50,supplier:'AromaCare',updated:'2026-06-11'},
    {id:'I-006',name:'Bottled Water (500ml)',category:'Beverages',quantity:520,reorder:200,supplier:'PureSpring',updated:'2026-06-14'},
    {id:'I-007',name:'Toilet Paper Rolls',category:'Toiletries',quantity:310,reorder:120,supplier:'AromaCare',updated:'2026-06-12'},
    {id:'I-008',name:'Multi-Surface Cleaner',category:'Cleaning',quantity:18,reorder:25,supplier:'CleanPro Supplies',updated:'2026-06-09'},
    {id:'I-009',name:'Floor Disinfectant (5L)',category:'Cleaning',quantity:0,reorder:10,supplier:'CleanPro Supplies',updated:'2026-06-08'},
    {id:'I-010',name:'Laundry Detergent',category:'Cleaning',quantity:34,reorder:20,supplier:'CleanPro Supplies',updated:'2026-06-12'},
    {id:'I-011',name:'Coffee Pods',category:'Beverages',quantity:480,reorder:150,supplier:'Roast & Co.',updated:'2026-06-13'},
    {id:'I-012',name:'Tea Bags (Assorted)',category:'Beverages',quantity:95,reorder:100,supplier:'Roast & Co.',updated:'2026-06-11'}
  ];

  const seedPayments = [
    {id:'PAY-20451',guestId:'G-1042',guest:'Amara Okafor',room:'304',amount:480000,paid:480000,date:'2026-06-12',method:'Card',status:'Completed'},
    {id:'PAY-20452',guestId:'G-1043',guest:'David Mensah',room:'118',amount:78000,paid:78000,date:'2026-06-14',method:'Card',status:'Completed'},
    {id:'PAY-20453',guestId:'G-1046',guest:'Liu Wei',room:'507',amount:620000,paid:310000,date:'2026-06-13',method:'Bank Transfer',status:'Pending'},
    {id:'PAY-20454',guestId:'G-1045',guest:'Tunde Bakare',room:'201',amount:240000,paid:240000,date:'2026-06-11',method:'Cash',status:'Completed'},
    {id:'PAY-20455',guestId:'G-1049',guest:'Priya Raman',room:'221',amount:295000,paid:0,date:'2026-06-14',method:'Card',status:'Pending'},
    {id:'PAY-20456',guestId:'G-1048',guest:'James O\u2019Connor',room:'305',amount:185000,paid:185000,date:'2026-06-02',method:'Card',status:'Refunded'},
    {id:'PAY-20457',guestId:'G-1044',guest:'Sofia Albright',room:'—',amount:520000,paid:100000,date:'2026-06-14',method:'Bank Transfer',status:'Pending'},
    {id:'PAY-20458',guestId:'G-1047',guest:'Fatima Salisu',room:'—',amount:340000,paid:340000,date:'2026-06-10',method:'Card',status:'Completed'}
  ];

  function load(k,seed){
    try{const v=localStorage.getItem(k); if(v) return JSON.parse(v);}catch(e){}
    localStorage.setItem(k,JSON.stringify(seed));
    return seed;
  }
  function save(k,v){localStorage.setItem(k,JSON.stringify(v));}

  window.HMS = {
    getGuests:()=>load(KEY_G,seedGuests),
    saveGuests:(d)=>save(KEY_G,d),
    getInventory:()=>load(KEY_I,seedInventory),
    saveInventory:(d)=>save(KEY_I,d),
    getPayments:()=>load(KEY_P,seedPayments),
    savePayments:(d)=>save(KEY_P,d),
    money:(n)=>'\u20A6'+(n||0).toLocaleString(),
    fmtDate:(s)=>{ if(!s) return '—'; const d=new Date(s); return d.toLocaleDateString('en-US',{year:'numeric',month:'short',day:'numeric'});},
    reset:()=>{localStorage.removeItem(KEY_G);localStorage.removeItem(KEY_I);localStorage.removeItem(KEY_P);}
  };
})();
