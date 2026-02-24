<template>
  <div class="min-h-screen flex relative bg-[#F8FAFC]">
      
      <div v-if="showLogoutConfirm" class="fixed inset-0 z-[250] flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="showLogoutConfirm = false"></div>
          <div class="relative bg-white w-full max-w-sm rounded-[2rem] p-8 text-center shadow-2xl animate-pop">
              <div class="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-5">
                  <i class="ph-fill ph-sign-out text-4xl"></i>
              </div>
              <h3 class="text-2xl font-black text-slate-900 mb-2 font-['Noto_Serif_Khmer']">ចាកចេញពីប្រព័ន្ធ?</h3>
              <p class="text-slate-500 text-sm mb-8 font-['Noto_Serif_Khmer']">តើអ្នកពិតជាចង់ចាកចេញពីគណនីនេះមែនទេ?</p>
              <div class="flex gap-3">
                  <button @click="showLogoutConfirm = false" class="flex-1 py-3.5 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition">បោះបង់</button>
                  <button @click="executeLogout" class="flex-1 py-3.5 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30 transition">ចាកចេញ</button>
              </div>
          </div>
      </div>

      <aside class="hidden md:flex flex-col smart-sidebar w-[5.5rem] h-screen bg-slate-900 border-r border-slate-800 fixed left-0 top-0 z-50 py-6 text-slate-400 group shadow-2xl">
          <div class="flex items-center px-6 mb-10 h-10">
              <div class="w-10 h-10 bg-gradient-to-tr from-blue-600 to-teal-400 rounded-xl flex shrink-0 items-center justify-center text-white text-xl font-black shadow-lg">S</div>
              <span class="ml-4 font-black text-xl text-white menu-text tracking-tight">S-pos<span class="text-blue-500">.</span></span>
          </div>

          <nav class="flex-1 space-y-2 px-3 w-full">
              <button @click="currentView = 'pos'" :class="currentView === 'pos' ? 'bg-blue-600/10 text-blue-500' : 'hover:bg-slate-800 hover:text-white'" class="flex items-center w-full px-3 py-3.5 rounded-xl transition-all">
                  <i class="ph-fill ph-storefront text-2xl shrink-0"></i>
                  <span class="ml-4 font-bold menu-text text-sm font-['Noto_Serif_Khmer']">POS / ហាង</span>
              </button>
              <button @click="currentView = 'report'" :class="currentView === 'report' ? 'bg-blue-600/10 text-blue-500' : 'hover:bg-slate-800 hover:text-white'" class="flex items-center w-full px-3 py-3.5 rounded-xl transition-all">
                  <i class="ph-fill ph-chart-line-up text-2xl shrink-0"></i>
                  <span class="ml-4 font-bold menu-text text-sm font-['Noto_Serif_Khmer']">របាយការណ៍លក់</span>
              </button>
              <button @click="currentView = 'account'" :class="currentView === 'account' ? 'bg-blue-600/10 text-blue-500' : 'hover:bg-slate-800 hover:text-white'" class="flex items-center w-full px-3 py-3.5 rounded-xl transition-all">
                  <i class="ph-fill ph-user-circle text-2xl shrink-0"></i>
                  <span class="ml-4 font-bold menu-text text-sm font-['Noto_Serif_Khmer']">គណនីរបស់ខ្ញុំ</span>
              </button>
              <button @click="showCart = true" class="flex items-center w-full px-3 py-3.5 hover:bg-slate-800 hover:text-white rounded-xl transition-all relative">
                  <i class="ph-fill ph-shopping-cart text-2xl shrink-0"></i>
                  <span class="ml-4 font-bold menu-text text-sm flex-1 text-left">Cart</span>
                  <span v-if="cartTotalQty > 0" class="absolute left-7 top-2 bg-red-500 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">{{ cartTotalQty }}</span>
              </button>
          </nav>

          <div class="px-3 mt-auto">
              <button @click="showLogoutConfirm = true" class="flex items-center w-full px-3 py-3.5 hover:bg-red-500/10 text-red-400 hover:text-red-500 rounded-xl transition-all">
                  <i class="ph-bold ph-sign-out text-2xl shrink-0"></i>
                  <span class="ml-4 font-bold menu-text text-sm">Log Out</span>
              </button>
              
              <div class="flex items-center px-3 mt-4 overflow-hidden h-12">
                  <div class="w-10 h-10 bg-slate-800 rounded-full flex shrink-0 items-center justify-center overflow-hidden border border-slate-700">
                      <img v-if="userPhotoUrl" :src="userPhotoUrl" class="w-full h-full object-cover" alt="Profile">
                      <i v-else class="ph-fill ph-user text-slate-400"></i>
                  </div>
                  <div class="ml-3 menu-text flex flex-col justify-center">
                      <span class="text-sm font-bold text-white leading-tight uppercase">{{ loggedInUserFullName }}</span>
                      <span class="text-[10px] font-bold text-blue-400 uppercase tracking-wider">{{ userRole }}</span>
                  </div>
              </div>
          </div>
      </aside>

      <main class="flex-1 min-h-screen md:ml-[5.5rem] pb-24 md:pb-12 bg-[#F8FAFC] transition-all duration-300">
          <header class="md:hidden flex items-center justify-between p-4 bg-white shadow-sm sticky top-0 z-40">
              <div class="flex items-center gap-2">
                  <div class="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold">S</div>
                  <h1 class="font-black text-lg text-slate-900 font-['Noto_Serif_Khmer']">
                      {{ currentView === 'pos' ? 'S-pos-system' : (currentView === 'report' ? 'របាយការណ៍លក់' : 'គណនីរបស់ខ្ញុំ') }}
                  </h1>
              </div>
              <div class="w-8 h-8 rounded-full overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center" @click="showLogoutConfirm = true">
                  <img v-if="userPhotoUrl" :src="userPhotoUrl" class="w-full h-full object-cover">
                  <i v-else class="ph-fill ph-user text-slate-400"></i>
              </div>
          </header>

          <transition name="page" mode="out-in">
              <div v-if="currentView === 'pos'" key="pos" class="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
                  <div class="flex justify-between items-end mb-8">
                      <div>
                          <h2 class="text-2xl md:text-3xl font-black text-slate-900 tracking-tight font-['Noto_Serif_Khmer']">បញ្ជីទំនិញ</h2>
                          <p class="text-slate-500 text-sm mt-1 font-['Noto_Serif_Khmer']">ជ្រើសរើសទំនិញដើម្បីលក់</p>
                      </div>
                  </div>
                  
                  <div v-if="isLoadingProducts" class="text-center py-20 text-slate-400 font-['Noto_Serif_Khmer']">
                      <i class="ph-bold ph-spinner animate-spin text-2xl mb-2"></i><br>កំពុងទាញទិន្នន័យ...
                  </div>
                  <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                      <div v-for="product in products" :key="product.id" class="group bg-white rounded-[1.5rem] p-3 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 flex flex-col h-full">
                          <div class="relative overflow-hidden rounded-[1rem] bg-slate-50 aspect-square mb-3">
                              <img :src="product.image || 'https://via.placeholder.com/300?text=No+Image'" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                              <div class="absolute top-2 left-2 bg-slate-900/80 backdrop-blur text-white text-[10px] font-bold px-2 py-1 rounded-md">In Stock: {{ product.stockQty }}</div>
                          </div>
                          <h3 class="font-bold text-slate-800 text-sm md:text-base line-clamp-2 mb-3 leading-snug">{{ product.name }}</h3>
                          <div class="mt-auto space-y-2 font-['Noto_Serif_Khmer']">
                              <div @click.stop="addToCart(product, 'retail')" class="flex items-center justify-between p-2 md:p-2.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-blue-300 hover:bg-blue-50/50 transition cursor-pointer group/btn">
                                  <div class="flex flex-col">
                                      <span class="text-[10px] font-bold text-slate-400">លក់រាយ ({{ product.retailUnit }})</span>
                                      <span class="font-black text-blue-600 text-sm">${{ product.retailPrice.toLocaleString('en-US', {minimumFractionDigits: 2}) }}</span>
                                  </div>
                                  <div class="w-7 h-7 rounded-full bg-white shadow-sm flex items-center justify-center text-blue-600"><i class="ph-bold ph-plus"></i></div>
                              </div>
                              <div @click.stop="addToCart(product, 'wholesale')" class="flex items-center justify-between p-2 md:p-2.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-teal-300 hover:bg-teal-50/50 transition cursor-pointer group/btn" :class="userRole === 'dealer' ? 'ring-1 ring-teal-500/30 bg-teal-50/30' : ''">
                                  <div class="flex flex-col">
                                      <span class="text-[10px] font-bold text-slate-400">បោះដុំ ({{ product.wholesaleUnit }})</span>
                                      <span class="font-black text-teal-600 text-sm">${{ product.wholesalePrice.toLocaleString('en-US', {minimumFractionDigits: 2}) }}</span>
                                  </div>
                                  <div class="w-7 h-7 rounded-full bg-white shadow-sm flex items-center justify-center text-teal-600"><i class="ph-bold ph-plus"></i></div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>

              <div v-else-if="currentView === 'report'" key="report" class="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
                  <div class="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 font-['Noto_Serif_Khmer']">
                      <div>
                          <h2 class="text-2xl md:text-3xl font-black text-slate-900 tracking-tight hidden md:block">របាយការណ៍លក់</h2>
                          <p class="text-slate-500 mt-1 text-sm md:text-base">ទិន្នន័យស្វ័យប្រវត្តិពីប្រព័ន្ធ</p>
                      </div>
                      <div class="flex flex-wrap w-full md:w-auto bg-white rounded-xl shadow-sm border border-slate-200 p-1">
                          <button @click="filterType = 'today'" :class="filterType === 'today' ? 'bg-slate-900 text-white shadow' : 'text-slate-600 hover:bg-slate-50'" class="px-4 py-2.5 rounded-lg text-sm font-bold transition flex-1 text-center whitespace-nowrap">ថ្ងៃនេះ</button>
                          <button @click="filterType = 'month'" :class="filterType === 'month' ? 'bg-slate-900 text-white shadow' : 'text-slate-600 hover:bg-slate-50'" class="px-4 py-2.5 rounded-lg text-sm font-bold transition flex-1 text-center whitespace-nowrap">ខែនេះ</button>
                          <button @click="filterType = 'year'" :class="filterType === 'year' ? 'bg-slate-900 text-white shadow' : 'text-slate-600 hover:bg-slate-50'" class="px-4 py-2.5 rounded-lg text-sm font-bold transition flex-1 text-center whitespace-nowrap">ឆ្នាំនេះ</button>
                          <button @click="filterType = 'all'" :class="filterType === 'all' ? 'bg-slate-900 text-white shadow' : 'text-slate-600 hover:bg-slate-50'" class="px-4 py-2.5 rounded-lg text-sm font-bold transition flex-1 text-center whitespace-nowrap">ទាំងអស់</button>
                      </div>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8 font-['Noto_Serif_Khmer']">
                      <div class="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-[2rem] shadow-lg text-white relative overflow-hidden flex items-center">
                          <i class="ph-fill ph-currency-dollar text-7xl opacity-20 absolute -right-2 -bottom-2"></i>
                          <div class="relative z-10 w-full">
                              <p class="text-[12px] font-medium text-blue-100 mb-1">ចំណូលសរុប (REVENUE)</p>
                              <h3 class="text-3xl md:text-4xl font-black">${{ totalRevenue.toLocaleString('en-US', {minimumFractionDigits: 2}) }}</h3>
                          </div>
                      </div>
                      <div class="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5 relative overflow-hidden group">
                          <div class="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center text-3xl shrink-0 group-hover:scale-110 transition-transform"><i class="ph-fill ph-receipt"></i></div>
                          <div>
                              <p class="text-[11px] font-bold text-slate-400">ចំនួនវិក្កយបត្រសរុប</p>
                              <h3 class="text-2xl md:text-3xl font-black text-slate-900 mt-0.5">{{ filteredReports.length }}</h3>
                          </div>
                      </div>
                      <div class="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5 relative overflow-hidden group">
                          <div class="w-14 h-14 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center text-3xl shrink-0 group-hover:scale-110 transition-transform"><i class="ph-fill ph-clock-countdown"></i></div>
                          <div>
                              <p class="text-[11px] font-bold text-slate-400">រង់ចាំការទូទាត់ប្រាក់</p>
                              <h3 class="text-2xl md:text-3xl font-black text-slate-900 mt-0.5">{{ pendingOrdersCount }}</h3>
                          </div>
                      </div>
                  </div>

                  <div v-if="isLoadingReports" class="text-center py-12">
                      <i class="ph-bold ph-spinner animate-spin text-4xl text-blue-500 mx-auto"></i>
                      <p class="text-slate-500 mt-3 font-['Noto_Serif_Khmer']">កំពុងទាញយកទិន្នន័យ...</p>
                  </div>
                  
                  <div v-else-if="filteredReports.length === 0" class="text-center py-16 bg-white rounded-[2rem] border border-slate-100 border-dashed">
                      <i class="ph-fill ph-receipt text-5xl text-slate-300 mx-auto mb-3"></i>
                      <h3 class="text-lg font-bold text-slate-700 font-['Noto_Serif_Khmer']">ពុំមានទិន្នន័យលក់ទេ</h3>
                      <p class="text-slate-500 text-sm mt-1 font-['Noto_Serif_Khmer']">មិនមានប្រតិបត្តិការលក់ណាមួយ សម្រាប់ពេលវេលាដែលបានជ្រើសរើសឡើយ។</p>
                  </div>

                  <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5 font-['Noto_Serif_Khmer']">
                      <div v-for="report in filteredReports" :key="report.id" class="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-blue-100 transition-all duration-200 flex flex-col relative group">
                          
                          <div class="flex justify-between items-start border-b border-slate-100 pb-3 mb-3">
                              <div class="text-xs text-slate-500 font-medium flex items-center gap-1.5"><i class="ph-bold ph-calendar-blank"></i> {{ formatDate(report.createdAt) }}</div>
                              <span v-if="report.paymentStatus === 'PAID'" class="bg-green-50 text-green-600 border border-green-200 px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1"><i class="ph-bold ph-check"></i> បានទូទាត់</span>
                              <span v-else-if="report.paymentStatus === 'CANCELLED'" class="bg-red-50 text-red-600 border border-red-200 px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1"><i class="ph-bold ph-x"></i> បានលុបចោល</span>
                              <span v-else class="bg-orange-50 text-orange-600 border border-orange-200 px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1"><i class="ph-bold ph-clock"></i> រង់ចាំទូទាត់</span>
                          </div>
                          
                          <div class="space-y-2.5 text-sm flex-1">
                              <div class="font-bold text-slate-900 text-base flex items-center justify-between gap-2">
                                  <div class="flex items-center gap-2 overflow-hidden">
                                    <div class="w-6 h-6 rounded-md bg-slate-50 text-slate-400 flex items-center justify-center shrink-0"><i class="ph-fill ph-user"></i></div>
                                    <span class="truncate">{{ report.customerName || 'មិនបញ្ជាក់' }}</span>
                                  </div>
                                  <div class="flex gap-1">
                                      <button v-if="report.paymentStatus === 'PENDING'" @click="openEditModal(report)" class="w-7 h-7 flex items-center justify-center rounded bg-slate-50 text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition" title="កែប្រែព័ត៌មាន"><i class="ph-bold ph-pencil-simple"></i></button>
                                      <button @click="viewInvoice(report)" class="w-7 h-7 flex items-center justify-center rounded bg-slate-50 text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition" title="មើលវិក្កយបត្រ"><i class="ph-bold ph-receipt"></i></button>
                                  </div>
                              </div>
                              <div class="text-slate-600 flex items-center gap-2">
                                  <div class="w-6 h-6 rounded-md bg-slate-50 text-slate-400 flex items-center justify-center shrink-0"><i class="ph-fill ph-phone"></i></div>
                                  <span>{{ report.customerPhone || 'N/A' }}</span>
                              </div>
                              <div class="text-blue-600 font-medium flex items-start gap-2">
                                  <div class="w-6 h-6 rounded-md bg-blue-50 text-blue-500 flex items-center justify-center shrink-0"><i class="ph-fill ph-map-pin"></i></div>
                                  <div class="flex flex-col">
                                      <span class="line-clamp-2 mt-0.5">{{ report.location || 'N/A' }}</span>
                                      <span v-if="report.transportCompany" class="text-[10px] text-slate-400 mt-0.5">{{ report.transportCompany }} ({{ report.branch }})</span>
                                  </div>
                              </div>
                          </div>

                          <div class="pt-4 mt-4 border-t border-slate-100 flex justify-between items-end">
                              <div>
                                  <span class="text-[10px] text-slate-500 font-bold block mb-0.5 uppercase tracking-wider">សរុបទឹកប្រាក់</span>
                                  <div class="text-xl font-black" :class="report.paymentStatus === 'CANCELLED' ? 'text-slate-400 line-through' : 'text-slate-900'">${{ report.totalAmount.toLocaleString('en-US', {minimumFractionDigits: 2}) }}</div>
                              </div>
                              <div v-if="report.paymentStatus === 'PENDING'" class="flex gap-2">
                                  <button @click="cancelPendingOrder(report)" class="w-9 h-9 flex items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors" title="លុបចោល"><i class="ph-bold ph-x"></i></button>
                                  <button @click="openPayPendingModal(report)" class="px-4 h-9 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition shadow-sm">ទូទាត់</button>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>

              <div v-else-if="currentView === 'account'" key="account" class="px-4 md:px-8 py-8 md:py-12">
                  <MyAccount />
              </div>
          </transition>
      </main>

      <nav class="md:hidden fixed bottom-0 w-full bg-white/90 backdrop-blur-xl border-t border-slate-100 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] z-40 pb-safe no-print">
          <div class="flex justify-around items-center h-16 px-2">
              <button @click="currentView = 'pos'" :class="currentView === 'pos' ? 'text-blue-600 scale-110' : 'text-slate-400 hover:text-slate-600'" class="flex-1 flex flex-col items-center justify-center gap-1 transition-all">
                  <i class="text-2xl" :class="currentView === 'pos' ? 'ph-fill ph-storefront' : 'ph ph-storefront'"></i><span class="text-[9px] font-bold font-['Noto_Serif_Khmer']">ហាង</span>
              </button>
              <button @click="currentView = 'report'" :class="currentView === 'report' ? 'text-blue-600 scale-110' : 'text-slate-400 hover:text-slate-600'" class="flex-1 flex flex-col items-center justify-center gap-1 transition-all">
                  <i class="text-2xl" :class="currentView === 'report' ? 'ph-fill ph-chart-line-up' : 'ph ph-chart-line-up'"></i><span class="text-[9px] font-bold font-['Noto_Serif_Khmer']">របាយការណ៍</span>
              </button>
              <button @click="currentView = 'account'" :class="currentView === 'account' ? 'text-blue-600 scale-110' : 'text-slate-400 hover:text-slate-600'" class="flex-1 flex flex-col items-center justify-center gap-1 transition-all">
                  <i class="text-2xl" :class="currentView === 'account' ? 'ph-fill ph-user-circle' : 'ph ph-user-circle'"></i><span class="text-[9px] font-bold font-['Noto_Serif_Khmer']">គណនី</span>
              </button>
              <button @click="showCart = true" class="flex-1 relative flex flex-col items-center justify-center -mt-6">
                  <div class="w-14 h-14 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-lg border-4 border-[#F8FAFC]">
                      <i class="ph-fill ph-shopping-bag text-2xl"></i>
                      <span v-if="cartTotalQty > 0" class="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">{{ cartTotalQty }}</span>
                  </div>
                  <span class="text-[9px] font-bold text-slate-800 mt-1">Cart</span>
              </button>
          </div>
      </nav>

      <transition name="slide-right">
          <div v-if="showCart" class="fixed inset-0 z-50 flex justify-end no-print">
              <div @click="showCart = false" class="absolute inset-0 bg-slate-900/30 backdrop-blur-sm"></div>
              <div class="relative bg-white w-full max-w-md h-full shadow-2xl flex flex-col">
                  <div class="p-6 border-b border-slate-100 flex justify-between items-center font-['Noto_Serif_Khmer']">
                      <h2 class="text-xl font-bold flex items-center gap-2">កន្ត្រកទំនិញ <span class="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">{{ cartTotalQty }}</span></h2>
                      <button @click="showCart = false" class="p-2 hover:bg-slate-100 rounded-full"><i class="ph-bold ph-x text-lg"></i></button>
                  </div>
                  <div class="flex-1 overflow-y-auto p-4 space-y-4 font-['Noto_Serif_Khmer'] custom-scrollbar">
                      <div v-if="cart.length === 0" class="text-center pt-20 text-slate-400">កន្ត្រកទទេរ</div>
                      <div v-for="(item, index) in cart" :key="index" class="flex gap-4 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                          <div class="w-16 h-16 rounded-xl overflow-hidden bg-white shrink-0"><img :src="item.image" class="w-full h-full object-cover"></div>
                          <div class="flex-1 flex flex-col justify-between">
                              <div>
                                  <div class="flex justify-between items-start">
                                      <h4 class="font-bold text-slate-800 text-sm leading-snug pr-2">{{ item.name }}</h4>
                                      <button @click="removeFromCart(index)" class="text-slate-300 hover:text-red-500"><i class="ph-bold ph-trash"></i></button>
                                  </div>
                                  <p class="text-[10px] font-bold mt-0.5" :class="item.type === 'wholesale' ? 'text-teal-600' : 'text-blue-600'">{{ item.type === 'wholesale' ? 'បោះដុំ' : 'លក់រាយ' }} ({{ item.unit }})</p>
                              </div>
                              <div class="flex items-center justify-between mt-2">
                                  <p class="font-black text-slate-900">${{ item.price.toLocaleString('en-US', {minimumFractionDigits: 2}) }}</p>
                                  <div class="flex items-center gap-3 bg-white rounded-lg px-2 py-1 border border-slate-200">
                                      <button @click="updateQty(index, -1)" class="w-5 h-5 flex items-center justify-center hover:bg-slate-50 rounded text-xs" :disabled="item.qty <= 1"><i class="ph-bold ph-minus"></i></button>
                                      <span class="text-xs font-bold w-3 text-center">{{ item.qty }}</span>
                                      <button @click="updateQty(index, 1)" class="w-5 h-5 flex items-center justify-center hover:bg-slate-50 rounded text-xs"><i class="ph-bold ph-plus"></i></button>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
                  <div class="p-6 border-t border-slate-100 bg-white pb-safe font-['Noto_Serif_Khmer']">
                      <div class="flex justify-between text-xl font-black text-slate-900 mb-4"><span>សរុប (Total)</span><span>${{ cartTotal.toLocaleString('en-US', {minimumFractionDigits: 2}) }}</span></div>
                      <button v-if="cart.length > 0" @click="startCheckout" class="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-blue-600 transition flex items-center justify-center gap-2 shadow-lg">
                          បញ្ជាក់ការទិញ (Checkout) <i class="ph-bold ph-arrow-right"></i>
                      </button>
                  </div>
              </div>
          </div>
      </transition>

      <div v-if="showCheckout" class="fixed inset-0 z-[100] flex items-center justify-center p-4 no-print">
          <div @click="showCheckout = false" class="absolute inset-0 bg-slate-900/70 backdrop-blur-sm"></div>
          <div class="relative z-10 bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-visible animate-pop font-['Noto_Serif_Khmer'] flex flex-col max-h-[90vh]">
              
              <div class="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center rounded-t-[2.5rem] shrink-0">
                  <h2 class="text-xl font-black text-slate-900 flex items-center gap-2">
                      <div class="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center"><i class="ph-bold ph-shopping-cart"></i></div>
                      ព័ត៌មានអតិថិជន
                  </h2>
                  <button @click="showCheckout = false" class="text-slate-400 hover:text-slate-800 hover:bg-slate-200 bg-white border border-slate-200 w-8 h-8 rounded-full flex items-center justify-center shadow-sm transition"><i class="ph-bold ph-x"></i></button>
              </div>

              <div class="p-6 space-y-4 overflow-y-auto custom-scrollbar">
                  
                  <div class="flex gap-2 p-1 bg-slate-100/80 rounded-xl mb-2 border border-slate-200">
                      <button @click="form.city = 'ភ្នំពេញ'" :class="form.city === 'ភ្នំពេញ' ? 'bg-white shadow-sm text-blue-600 border border-slate-200' : 'text-slate-500 hover:text-slate-700'" class="flex-1 py-2.5 rounded-lg text-sm font-bold transition-all">ភ្នំពេញ (COD)</button>
                      <button @click="form.city = 'ខេត្ត'" :class="form.city !== 'ភ្នំពេញ' ? 'bg-white shadow-sm text-blue-600 border border-slate-200' : 'text-slate-500 hover:text-slate-700'" class="flex-1 py-2.5 rounded-lg text-sm font-bold transition-all">តាមខេត្ត</button>
                  </div>

                  <div class="space-y-1.5 relative">
                      <label class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">ឈ្មោះអតិថិជន *</label>
                      <div class="relative">
                          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><i class="ph-fill ph-user text-slate-400 text-lg"></i></div>
                          <input 
                              v-model="form.name" 
                              type="text" 
                              ref="nameInput"
                              @focus="showCustomerDropdown = true"
                              @blur="hideCustomerDropdown"
                              @input="handleNameInput"
                              @keydown.down.prevent="highlightNextCustomer"
                              @keydown.up.prevent="highlightPrevCustomer"
                              @keydown.enter.prevent="handleNameEnter"
                              class="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-slate-800" 
                              placeholder="ឧ. ដារ៉ូ">
                          
                          <button v-if="form.name" @click.prevent="clearCustomerForm" class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-red-500 transition-colors">
                              <i class="ph-fill ph-x-circle text-xl"></i>
                          </button>
                      </div>

                      <transition name="fade">
                          <ul v-if="showCustomerDropdown && filteredCustomers.length > 0" class="absolute z-50 w-full bg-white border border-slate-100 rounded-xl shadow-2xl mt-1 max-h-48 overflow-y-auto custom-scrollbar">
                              <li v-for="(cust, index) in filteredCustomers" :key="index"
                                  @mousedown.prevent="selectCustomer(cust)"
                                  @mouseenter="highlightedCustomerIndex = index"
                                  :class="{'bg-blue-50 text-blue-700 border-l-4 border-blue-500': highlightedCustomerIndex === index, 'text-slate-700 border-l-4 border-transparent': highlightedCustomerIndex !== index}"
                                  class="px-4 py-3 cursor-pointer flex justify-between items-center transition-all border-b border-slate-50 last:border-0">
                                  <span class="font-bold">{{ cust.name }}</span>
                                  <span class="text-[11px] font-medium opacity-70 bg-white/50 px-2 py-0.5 rounded-md flex items-center gap-1"><i class="ph-fill ph-phone"></i> {{ cust.phone }}</span>
                              </li>
                          </ul>
                      </transition>
                  </div>

                  <div class="space-y-1.5">
                      <label class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">លេខទូរស័ព្ទ *</label>
                      <div class="relative">
                          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><i class="ph-fill ph-phone text-slate-400 text-lg"></i></div>
                          <input 
                              v-model="form.phone" 
                              type="tel" 
                              ref="phoneInput"
                              @keydown.enter.prevent="focusNextField"
                              class="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-medium text-slate-800" 
                              placeholder="012 345 678">
                      </div>
                  </div>

                  <div v-if="form.city === 'ភ្នំពេញ'" class="space-y-3 animate-fade pt-1">
                      <div class="space-y-1.5">
                          <label class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">ទីតាំង (Google Maps Link)</label>
                          <div class="relative">
                              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><i class="ph-fill ph-map-pin text-slate-400 text-lg"></i></div>
                              <input 
                                  v-model="form.mapsLink" 
                                  type="url" 
                                  ref="mapsLinkInput"
                                  @keydown.enter.prevent="processPendingOrder"
                                  class="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-blue-600 font-medium" 
                                  placeholder="http://googleusercontent.com/maps...">
                          </div>
                      </div>
                      <div class="bg-orange-50 border border-orange-100 p-3 rounded-xl flex gap-3 items-start shadow-sm">
                          <i class="ph-fill ph-warning-circle text-orange-500 text-xl mt-0.5"></i>
                          <p class="text-[11px] text-orange-800 font-medium leading-relaxed">កំណត់សម្គាល់: ការកម្ម៉ង់នេះមិនទាន់ទូទាត់ប្រាក់ទេ។ អតិថិជនត្រូវទូទាត់ប្រាក់ពេលអ្នកដឹកជញ្ជូនយកឥវ៉ាន់ទៅដល់ទីតាំង (COD)។</p>
                      </div>
                  </div>

                  <div v-if="form.city !== 'ភ្នំពេញ'" class="space-y-3 animate-fade pt-1">
                      <div class="grid grid-cols-2 gap-3">
                          <div class="space-y-1.5">
                              <label class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">ខេត្ត</label>
                              <input 
                                  v-model="form.province" 
                                  type="text" 
                                  ref="provinceInput"
                                  @keydown.enter.prevent="() => $refs.branchInput.focus()"
                                  class="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-medium" 
                                  placeholder="បញ្ជូលខេត្ត...">
                          </div>
                          <div class="space-y-1.5">
                              <label class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">ក្រុមហ៊ុនដឹកជញ្ជូន</label>
                              <select 
                                  v-model="form.transportCompany" 
                                  ref="transportSelect"
                                  @keydown.enter.prevent="() => $refs.branchInput.focus()"
                                  class="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none appearance-none font-bold text-blue-700 transition-all cursor-pointer">
                                  <option value="វីរៈប៊ុនថាំង">វីរៈប៊ុនថាំង</option>
                                  <option value="J&T">J&T Express</option>
                                  <option value="ឡានឈ្នួល">ឡានឈ្នួល</option>
                              </select>
                          </div>
                      </div>
                      <div class="space-y-1.5">
                          <label class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">បញ្ជាក់សាខា / កន្លែងផ្ញើ</label>
                          <input 
                              v-model="form.branch" 
                              type="text" 
                              ref="branchInput"
                              @keydown.enter.prevent="processOrder"
                              class="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-medium" 
                              placeholder="ឧ. សាខាអូឡាំពិក...">
                      </div>
                  </div>

                  <div class="bg-slate-50 p-4 rounded-xl space-y-2.5 mt-4 border border-slate-200">
                      <div class="flex justify-between text-xs font-bold text-slate-500">
                          <span>សរុបទំនិញ (Subtotal):</span>
                          <span class="text-slate-700">${{ cartTotal.toLocaleString('en-US', {minimumFractionDigits: 2}) }}</span>
                      </div>
                      <div class="flex justify-between text-xs font-bold text-slate-500 items-center">
                          <span>ថ្លៃដឹកជញ្ជូន (Delivery):</span>
                          <span v-if="deliveryFeeDetails.isFree" class="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded border border-green-200 uppercase tracking-wider">ឥតគិតថ្លៃ (Free)</span>
                          <span v-else class="text-slate-700">${{ deliveryFeeDetails.fee.toLocaleString('en-US', {minimumFractionDigits: 2}) }}</span>
                      </div>
                      <div class="flex justify-between text-base font-black text-slate-900 border-t border-slate-200 pt-2 mt-1">
                          <span>សរុបរួម (Grand Total):</span>
                          <span class="text-blue-600">${{ grandTotal.toLocaleString('en-US', {minimumFractionDigits: 2}) }}</span>
                      </div>
                  </div>

                  <button v-if="form.city === 'ភ្នំពេញ'" @click="processPendingOrder" :disabled="loading" class="w-full py-4 font-bold bg-orange-500 text-white rounded-xl hover:bg-orange-600 hover:shadow-orange-500/30 transition-all shadow-lg flex justify-center items-center gap-2 mt-2">
                      <span v-if="loading" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      <span v-else>រក្សាទុករង់ចាំបង់ប្រាក់ (Save Pending)</span>
                  </button>

                  <button v-if="form.city !== 'ភ្នំពេញ'" @click="processOrder" :disabled="loading" class="w-full py-4 font-bold bg-slate-900 text-white rounded-xl hover:bg-blue-600 hover:shadow-blue-600/30 transition-all shadow-lg flex justify-center items-center gap-2 mt-2">
                      <span v-if="loading" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      <span v-else>បន្តទៅទូទាត់តាម QR: ${{ grandTotal.toLocaleString('en-US', {minimumFractionDigits: 2}) }}</span>
                  </button>

              </div>
          </div>
      </div>

      <div v-if="showEditModal" class="fixed inset-0 z-[120] flex items-center justify-center p-4 no-print">
          <div @click="showEditModal = false" class="absolute inset-0 bg-slate-900/70 backdrop-blur-sm"></div>
          <div class="relative z-10 bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-pop font-['Noto_Serif_Khmer']">
              <div class="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                  <h2 class="text-xl font-black text-slate-900">កែប្រែព័ត៌មានអតិថិជន</h2>
                  <button @click="showEditModal = false" class="text-slate-400 hover:text-slate-800 bg-white w-8 h-8 rounded-full flex items-center justify-center shadow-sm"><i class="ph-bold ph-x"></i></button>
              </div>

              <div class="p-6 space-y-4">
                  <div class="space-y-1.5">
                      <label class="text-xs font-bold text-slate-500">ឈ្មោះអតិថិជន *</label>
                      <input v-model="editForm.name" type="text" class="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 outline-none">
                  </div>
                  <div class="space-y-1.5">
                      <label class="text-xs font-bold text-slate-500">លេខទូរស័ព្ទ *</label>
                      <input v-model="editForm.phone" type="text" class="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 outline-none">
                  </div>
                  <div class="space-y-1.5">
                      <label class="text-xs font-bold text-slate-500">ទីតាំង (រាជធានី/ខេត្ត) *</label>
                      <input v-model="editForm.location" type="text" class="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 outline-none">
                  </div>
                  
                  <div class="grid grid-cols-2 gap-3" v-if="editForm.location !== 'ភ្នំពេញ' && editForm.location !== 'ភ្នំពេញ (COD)'">
                      <div class="space-y-1.5">
                          <label class="text-xs font-bold text-slate-500">ក្រុមហ៊ុនដឹកជញ្ជូន</label>
                          <input v-model="editForm.transportCompany" type="text" class="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 outline-none">
                      </div>
                      <div class="space-y-1.5">
                          <label class="text-xs font-bold text-slate-500">សាខា / កន្លែងផ្ញើ</label>
                          <input v-model="editForm.branch" type="text" class="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 outline-none">
                      </div>
                  </div>

                  <button @click="saveEditOrder" :disabled="loading" class="w-full py-4 font-bold bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow-lg flex justify-center items-center gap-2 mt-2">
                      <span v-if="loading" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      <span v-else>រក្សាទុកការកែប្រែ</span>
                  </button>
              </div>
          </div>
      </div>

      <div v-if="showQR" class="fixed inset-0 z-[110] flex items-center justify-center p-4 no-print">
          <div class="absolute inset-0 bg-slate-900/85 backdrop-blur-md"></div>
          
          <div class="relative bg-white w-full max-w-[340px] rounded-[2.5rem] p-8 pb-6 text-center shadow-2xl animate-pop">
              
              <button @click="cancelPayment" class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-red-100 hover:text-red-500 transition-colors" title="បោះបង់ការទូទាត់">
                  <i class="ph-bold ph-x text-lg"></i>
              </button>

              <div class="absolute top-0 left-0 w-full h-1.5 bg-slate-100 rounded-t-[2.5rem] overflow-hidden">
                  <div class="h-full bg-gradient-to-r from-blue-500 via-teal-400 to-blue-500 transition-all duration-1000 ease-linear" :style="{ width: (qrTimeLeft / 330 * 100) + '%' }"></div>
              </div>
              
              <div class="flex items-center justify-center w-16 h-16 bg-blue-50 text-blue-600 rounded-full mx-auto mb-3 shadow-inner mt-2"><i class="ph-fill ph-qr-code text-3xl"></i></div>
              <h3 class="text-2xl font-black text-slate-900 font-['Noto_Serif_Khmer']">ស្កេនដើម្បីទូទាត់ប្រាក់</h3>
              
              <div id="qr-capture-area" class="bg-white p-5 rounded-[1.5rem] border-2 border-slate-100 shadow-sm inline-block mb-4 mt-4 w-full" style="background-color: #ffffff; color: #0f172a;">
                  <div class="text-sm mb-3">
                      <p class="font-bold text-slate-800 uppercase">{{ currentMerchantName }}</p>
                      <p class="text-[10px] text-slate-400 font-bold tracking-widest mt-0.5">ID: {{ currentMerchantId }}</p>
                  </div>
                  
                  <div id="qrcode" class="flex justify-center"></div>
                  
                  <div class="text-2xl font-black text-slate-900 mt-4 border-t border-slate-100 pt-3">
                      ${{ currentOrderTotal.toLocaleString('en-US', {minimumFractionDigits: 2}) }}
                  </div>
              </div>
              
              <div class="mb-4 text-sm font-bold font-['Noto_Serif_Khmer']" :class="qrTimeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-slate-500'">
                  ផុតកំណត់ក្នុង: {{ formatTime(qrTimeLeft) }}
              </div>

              <div class="flex gap-3 mt-6 no-print">
                  <button @click="shareQRImage" class="md:hidden flex-1 py-3.5 rounded-xl text-blue-500 font-bold bg-blue-50 hover:bg-blue-100 transition-colors flex items-center justify-center gap-2 shadow-sm">
                      <i class="ph-fill ph-telegram-logo text-2xl"></i> Share
                  </button>
                  <button @click="downloadQRImage" class="flex-1 py-3.5 rounded-xl text-blue-600 font-bold bg-blue-50 hover:bg-blue-600 hover:text-white transition-colors flex items-center justify-center gap-2 font-['Noto_Serif_Khmer'] shadow-sm">
                      <i class="ph-bold ph-download-simple text-xl"></i>
                      <span class="hidden md:inline">Save រូបថត QR</span>
                  </button>
              </div>
          </div>
      </div>

      <div v-if="showInvoice" class="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
          <div class="relative w-full max-w-md flex flex-col h-full md:h-auto max-h-[90vh]">
              
              <div class="flex justify-between items-center mb-4 no-print shrink-0 bg-white/10 p-2 rounded-2xl backdrop-blur border border-white/20">
                  <button @click="closeInvoice" class="w-10 h-10 bg-white/20 hover:bg-white/40 rounded-full text-white flex items-center justify-center transition"><i class="ph-bold ph-x text-xl"></i></button>
                  <div class="flex gap-2">
                      <button @click="downloadInvoiceImage" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl flex items-center gap-2 transition shadow-lg font-['Noto_Serif_Khmer']"><i class="ph-bold ph-download-simple"></i> Save រូបថត</button>
                      <button @click="printInvoice" class="px-4 py-2 bg-white text-slate-800 text-sm font-bold rounded-xl flex items-center gap-2 hover:bg-slate-100 transition shadow-lg font-['Noto_Serif_Khmer']"><i class="ph-bold ph-printer"></i> Print</button>
                  </div>
              </div>

              <div id="invoice-capture" class="bg-white rounded-[2rem] shadow-2xl overflow-y-auto flex-1 p-6 md:p-8 font-['Noto_Serif_Khmer'] text-slate-800 relative" style="background-color: #ffffff;">
                  <div v-if="currentInvoice.paymentStatus === 'PENDING'" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none rotate-[-30deg]">
                      <span class="text-6xl font-black text-orange-600 border-8 border-orange-600 px-6 py-2 rounded-3xl uppercase tracking-widest">រង់ចាំទូទាត់</span>
                  </div>
                  <div v-if="currentInvoice.paymentStatus === 'PAID'" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none rotate-[-30deg]">
                      <span class="text-6xl font-black text-slate-900 border-8 border-slate-900 px-6 py-2 rounded-3xl uppercase tracking-widest">PAID</span>
                  </div>

                  <div class="text-center mb-6 border-b border-slate-100 pb-6">
                      <div class="w-14 h-14 bg-slate-900 rounded-xl flex items-center justify-center text-white text-2xl font-black mx-auto mb-3 shadow-md">S</div>
                      <h2 class="text-xl font-black tracking-widest">វិក្កយបត្រ (INVOICE)</h2>
                      <p class="text-xs text-slate-500 mt-1">កាលបរិច្ឆេទ: {{ formatDate(currentInvoice.createdAt) }}</p>
                  </div>

                  <div class="bg-slate-50 p-5 rounded-2xl mb-6 text-sm border border-slate-100">
                      <div class="grid grid-cols-3 gap-y-3">
                          <span class="text-slate-500 font-medium">អតិថិជន:</span>
                          <span class="col-span-2 font-bold">{{ currentInvoice.customerName }}</span>
                          <span class="text-slate-500 font-medium">ទូរស័ព្ទ:</span>
                          <span class="col-span-2 font-bold">{{ currentInvoice.customerPhone }}</span>
                          <span class="text-slate-500 font-medium">ទីតាំង:</span>
                          <span class="col-span-2 font-bold">{{ currentInvoice.location }}</span>
                          <span v-if="currentInvoice.transportCompany" class="text-slate-500 font-medium">ដឹកតាម:</span>
                          <span v-if="currentInvoice.transportCompany" class="col-span-2 font-bold text-blue-600">{{ currentInvoice.transportCompany }} ({{ currentInvoice.branch }})</span>
                      </div>
                  </div>

                  <table class="w-full mb-6 text-sm border-collapse">
                      <thead>
                          <tr class="border-b-2 border-slate-200 text-slate-500">
                              <th class="text-left py-2 pb-3">បរិយាយ</th>
                              <th class="text-center py-2 pb-3">ចំនួន</th>
                              <th class="text-right py-2 pb-3">តម្លៃ</th>
                          </tr>
                      </thead>
                      <tbody class="divide-y divide-slate-100">
                          <tr v-for="item in currentInvoice.items" :key="item.id">
                              <td class="py-4">
                                  <p class="font-bold text-slate-900">{{ item.name }}</p>
                                  <p class="text-[10px] font-bold text-slate-400 mt-0.5 uppercase">{{ item.type === 'wholesale' ? 'បោះដុំ' : 'រាយ' }} ({{ item.unit }})</p>
                              </td>
                              <td class="py-4 text-center font-black">x{{ item.qty }}</td>
                              <td class="py-4 text-right font-black">${{ (item.price * item.qty).toLocaleString('en-US', {minimumFractionDigits: 2}) }}</td>
                          </tr>
                      </tbody>
                  </table>

                  <div class="border-t-2 border-slate-200 pt-4 pb-2">
                      <div class="flex justify-between items-center mb-2 text-sm text-slate-600 font-bold">
                          <span>សរុបទំនិញ (Subtotal):</span>
                          <span>${{ (currentInvoice.totalAmount - (currentInvoice.deliveryFee || 0)).toLocaleString('en-US', {minimumFractionDigits: 2}) }}</span>
                      </div>
                      <div class="flex justify-between items-center text-sm text-slate-600 font-bold mb-4">
                          <span>ថ្លៃដឹកជញ្ជូន (Delivery):</span>
                          <span v-if="currentInvoice.deliveryFee === 0" class="text-green-500 uppercase">Free</span>
                          <span v-else>${{ (currentInvoice.deliveryFee || 0).toLocaleString('en-US', {minimumFractionDigits: 2}) }}</span>
                      </div>
                  </div>

                  <div class="border-t-2 border-slate-800 pt-4 flex justify-between items-center mb-8">
                      <span class="font-bold text-lg">សរុប (TOTAL):</span>
                      <span class="font-black text-2xl text-blue-600">${{ currentInvoice.totalAmount.toLocaleString('en-US', {minimumFractionDigits: 2}) }}</span>
                  </div>

                  <div class="text-center text-xs text-slate-400 border-t border-slate-100 pt-6">
                      <p>បម្រើដោយ: <b class="text-slate-700">{{ currentInvoice.sellerName }}</b></p>
                      <p class="mt-1">សូមអរគុណសម្រាប់ការគាំទ្រ!</p>
                  </div>
              </div>
          </div>
      </div>

      <div v-if="showPendingPayModal" class="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm no-print">
          <div class="bg-white w-full max-w-sm rounded-[2rem] p-6 shadow-2xl font-['Noto_Serif_Khmer'] animate-pop">
              <h3 class="text-lg font-black text-slate-900 mb-4 border-b pb-3">ទូទាត់ប្រាក់ (អតិថិជន: {{ pendingOrderToPay.customerName }})</h3>
              
              <div class="bg-slate-50 p-4 rounded-xl text-center mb-4">
                  <p class="text-sm text-slate-500 mb-1">ទឹកប្រាក់ត្រូវបង់ (រួមទាំងថ្លៃដឹក)</p>
                  <p class="text-3xl font-black text-slate-900">${{ pendingOrderToPay.totalAmount.toLocaleString('en-US', {minimumFractionDigits: 2}) }}</p>
              </div>

              <div class="flex gap-2 mb-4">
                  <button @click="pendingPayMethod = 'qr'" :class="pendingPayMethod === 'qr' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'" class="flex-1 py-3 rounded-xl font-bold text-sm transition flex flex-col items-center justify-center gap-1"><i class="ph-bold ph-qr-code text-xl"></i> បង្ហាញ QR ម្ដងទៀត</button>
                  <button v-if="pendingOrderToPay.location && pendingOrderToPay.location.includes('ភ្នំពេញ')" @click="pendingPayMethod = 'cash'" :class="pendingPayMethod === 'cash' ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-600'" class="flex-1 py-3 rounded-xl font-bold text-sm transition flex flex-col items-center justify-center gap-1"><i class="ph-bold ph-money text-xl"></i> លុយសុទ្ធ</button>
              </div>

              <div v-if="pendingPayMethod === 'cash'" class="space-y-3 mb-4 animate-fade">
                  <input v-model="pendingCashAmount" type="number" class="w-full border border-slate-200 rounded-xl py-3 px-4 outline-none focus:border-green-500" placeholder="ចំនួនទឹកប្រាក់ទទួលបាន...">
                  <input v-model="pendingCashNote" type="text" class="w-full border border-slate-200 rounded-xl py-3 px-4 outline-none focus:border-green-500" placeholder="កំណត់សម្គាល់ (បើមាន)...">
              </div>

              <div class="flex gap-2">
                  <button @click="showPendingPayModal = false" class="px-4 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition">បោះបង់</button>
                  <button @click="confirmPendingPayment" :disabled="loading" class="flex-1 py-3 rounded-xl font-bold text-white shadow-lg transition flex items-center justify-center" :class="pendingPayMethod === 'cash' ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'">
                      <span v-if="loading" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      <span v-else>{{ pendingPayMethod === 'qr' ? 'បង្កើត QR' : 'យល់ព្រមទូទាត់' }}</span>
                  </button>
              </div>
          </div>
      </div>

      <div class="fixed bottom-20 md:bottom-4 right-0 z-[200] p-4 flex flex-col gap-3 w-full max-w-sm pointer-events-none no-print">
          <transition-group name="toast">
              <div v-for="note in notifications" :key="note.id" class="pointer-events-auto flex items-center gap-4 bg-white border border-slate-100 shadow-2xl p-4 rounded-2xl">
                  <div class="w-10 h-10 rounded-full flex items-center justify-center shrink-0" :class="note.type === 'error' ? 'bg-red-50 text-red-500' : note.type === 'warning' ? 'bg-orange-50 text-orange-500' : 'bg-green-50 text-green-500'">
                      <i class="ph-fill text-xl" :class="note.type === 'error' ? 'ph-warning-circle' : note.type === 'warning' ? 'ph-info' : 'ph-check-circle'"></i>
                  </div>
                  <div>
                      <h4 class="font-bold text-slate-900 text-sm font-['Noto_Serif_Khmer']">{{ note.title }}</h4>
                      <p class="text-xs text-slate-500 font-['Noto_Serif_Khmer']">{{ note.message }}</p>
                  </div>
              </div>
          </transition-group>
      </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
// ⭐️ ប្រើប្រាស់ onSnapshot សម្រាប់ Realtime Delivery Updates
import { db, collection, getDocs, query, doc, updateDoc, increment, addDoc, orderBy, getDoc, onSnapshot } from '../firebase';
import { io } from 'socket.io-client';
import qrcode from 'qrcode-generator';
import * as htmlToImage from 'html-to-image';

import MyAccount from '../components/MyAccount.vue';

const router = useRouter();
const API_URL = "https://api.sellerorder.fyi";

// State Variables
const currentView = ref('pos'); 
const showLogoutConfirm = ref(false);
const userRole = ref(''); 
const loggedInUserFullName = ref('');
const userPhotoUrl = ref('');
const adminName = ref(''); 
const loggedInUserId = ref(''); 
const adminId = ref(''); 

const socket = io(API_URL, { transports: ["polling", "websocket"] });
const products = ref([]);
const isLoadingProducts = ref(false);
const reports = ref([]);
const isLoadingReports = ref(false);
const filterType = ref('today');

// ⭐️ អថេរសម្រាប់ផ្ទុកទិន្នន័យ Delivery Fees
const deliverySettings = ref(null);

const cart = ref([]);
const showCart = ref(false);
const showCheckout = ref(false);
const showQR = ref(false);
const loading = ref(false);
const notifications = ref([]);

const form = reactive({ 
  name: '', phone: '', city: 'ភ្នំពេញ', province: '', 
  mapsLink: '', transportCompany: 'វីរៈប៊ុនថាំ', branch: '' 
});

// ================= START: មុខងារ Smart Dropdown និង Keyboard =================
const showCustomerDropdown = ref(false);
const highlightedCustomerIndex = ref(-1);

const nameInput = ref(null);
const phoneInput = ref(null);
const mapsLinkInput = ref(null);
const provinceInput = ref(null);
const transportSelect = ref(null);
const branchInput = ref(null);

const uniqueCustomers = computed(() => {
    const custMap = new Map();
    reports.value.forEach(r => {
        if (r.customerName && !custMap.has(r.customerName)) {
            custMap.set(r.customerName, {
                name: r.customerName,
                phone: r.customerPhone,
                location: r.location,
                mapsLink: r.mapsLink,
                transportCompany: r.transportCompany,
                branch: r.branch
            });
        }
    });
    return Array.from(custMap.values());
});

const filteredCustomers = computed(() => {
    if (!form.name) return [];
    const search = form.name.toLowerCase();
    return uniqueCustomers.value.filter(c => 
        (c.name && c.name.toLowerCase().includes(search)) || 
        (c.phone && c.phone.includes(search))
    ).slice(0, 5);
});

const handleNameInput = () => {
    showCustomerDropdown.value = true;
    highlightedCustomerIndex.value = -1;
    if (form.name.trim() === '') {
        form.phone = ''; form.mapsLink = ''; form.province = ''; form.branch = '';
    }
};

const clearCustomerForm = () => {
    form.name = ''; form.phone = ''; form.mapsLink = ''; form.province = ''; form.branch = '';
    showCustomerDropdown.value = false;
    if(nameInput.value) nameInput.value.focus();
};

const hideCustomerDropdown = () => { setTimeout(() => { showCustomerDropdown.value = false; }, 200); };

const selectCustomer = (customer) => {
    form.name = customer.name;
    form.phone = customer.phone || '';
    
    if (customer.location === 'ភ្នំពេញ' || customer.location === 'ភ្នំពេញ (COD)') {
        form.city = 'ភ្នំពេញ';
        form.mapsLink = customer.mapsLink || '';
    } else {
        form.city = 'ខេត្ត';
        form.province = customer.location || '';
        form.transportCompany = customer.transportCompany || 'វីរៈប៊ុនថាំ';
        form.branch = customer.branch || '';
    }
    
    showCustomerDropdown.value = false;
    setTimeout(() => { if(phoneInput.value) phoneInput.value.focus(); }, 50);
};

const highlightNextCustomer = () => { if (showCustomerDropdown.value && highlightedCustomerIndex.value < filteredCustomers.value.length - 1) highlightedCustomerIndex.value++; };
const highlightPrevCustomer = () => { if (showCustomerDropdown.value && highlightedCustomerIndex.value > 0) highlightedCustomerIndex.value--; };

const handleNameEnter = () => {
    if (showCustomerDropdown.value && highlightedCustomerIndex.value >= 0 && filteredCustomers.value.length > 0) {
        selectCustomer(filteredCustomers.value[highlightedCustomerIndex.value]);
    } else {
        showCustomerDropdown.value = false;
        if(phoneInput.value) phoneInput.value.focus();
    }
};

const focusNextField = () => {
    if (form.city === 'ភ្នំពេញ') {
        if(mapsLinkInput.value) mapsLinkInput.value.focus();
    } else {
        if(provinceInput.value) provinceInput.value.focus();
    }
};
// ================= END: មុខងារ Smart Dropdown និង Keyboard =================

const showInvoice = ref(false);
const currentInvoice = ref(null);

const showPendingPayModal = ref(false);
const pendingOrderToPay = ref(null);
const pendingPayMethod = ref('qr');
const pendingCashAmount = ref('');
const pendingCashNote = ref('');

const showEditModal = ref(false);
const editForm = reactive({ id: '', name: '', phone: '', location: '', transportCompany: '', branch: '' });

const qrTimeLeft = ref(330);
const currentMerchantId = ref('');
const currentMerchantName = ref('');

let timerInterval = null, pollTimer = null;
const currentHash = ref('');
const currentOrderTotal = ref(0);
const activePendingOrderId = ref(null); 

const notify = (title, message, type = 'success') => {
  const id = Date.now();
  notifications.value.push({ id, title, message, type });
  setTimeout(() => notifications.value = notifications.value.filter(n => n.id !== id), 4000);
};

onMounted(() => {
  const sessionData = localStorage.getItem('dpos_session');
  if (sessionData) {
      const session = JSON.parse(sessionData);
      loggedInUserFullName.value = session.fullName;
      userRole.value = session.role;
      userPhotoUrl.value = session.photoUrl;
      adminName.value = session.adminName || 'Admin';
      loggedInUserId.value = session.uid || '';
      adminId.value = session.createdBy || '';
      fetchProducts();
      fetchReports();
      fetchDeliverySettings(); // ⭐️ ចាប់ផ្តើមស្តាប់ទិន្នន័យដឹកជញ្ជូន
  } else {
      router.push('/login'); 
  }
  socket.on("payment-success", (data) => { 
      if(data.md5 === currentHash.value) handleSuccess(); 
  });
});

const executeLogout = () => { 
  localStorage.removeItem('dpos_session'); 
  router.push('/login'); 
};

// ------------------- ⭐️ ទាញយកទិន្នន័យ Settings តាមបែប Realtime -------------------
const fetchDeliverySettings = () => {
    try {
        const docRef = doc(db, "settings", "delivery_fees");
        // ប្រើ onSnapshot វានឹង Update ដោយស្វ័យប្រវត្តិពេលមានការកែប្រែក្នុង DB
        onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                deliverySettings.value = docSnap.data();
                // 💡 បន្ថែមការ Print ដើម្បីឱ្យអ្នកឃើញថាវាពិតជា Update មែនពេលកែក្នុង DB
                console.log("⚡️ Realtime Data Updated:", deliverySettings.value);
            }
        });
    } catch (e) {
        console.error("Error fetching delivery settings:", e);
    }
}

const fetchProducts = async () => {
  if (!db) return;
  isLoadingProducts.value = true;
  try {
      const querySnapshot = await getDocs(collection(db, "stocks"));
      const fetchedData = [];
      querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedData.push({
              id: doc.id, name: data.name || "Unknown",
              retailPrice: Number(data.retailPrice) || 0, retailUnit: data.retailUnit || "ដប",
              wholesalePrice: Number(data.wholesalePrice) || 0, wholesaleUnit: data.wholesaleUnit || "កេះ",
              stockQty: Number(data.quantity) || 0, image: data.image || "",
              sellerIncentive: Number(data.sellerIncentive) || 0,
              dealerIncentive: Number(data.dealerIncentive) || 0
          });
      });
      products.value = fetchedData;
  } catch (error) { console.error(error); } 
  finally { isLoadingProducts.value = false; }
};

const addToCart = (product, type = 'retail') => {
  const isWholesale = type === 'wholesale';
  const targetPrice = isWholesale ? product.wholesalePrice : product.retailPrice;
  const targetUnit = isWholesale ? product.wholesaleUnit : product.retailUnit;
  const targetIncentive = isWholesale ? product.dealerIncentive : product.sellerIncentive;
  const cartItemId = product.id + '_' + type;

  const existing = cart.value.find(item => item.cartItemId === cartItemId);
  if(existing) existing.qty++;
  else cart.value.push({ 
      id: product.id, cartItemId, name: product.name, image: product.image, 
      type, unit: targetUnit, price: targetPrice, qty: 1,
      incentiveAmount: targetIncentive 
  });
  notify("ចូលកន្ត្រក", `បានបន្ថែម ${product.name}`);
};

const removeFromCart = (index) => cart.value.splice(index, 1);
const updateQty = (index, change) => { if(cart.value[index].qty + change > 0) cart.value[index].qty += change; };

const cartTotalQty = computed(() => cart.value.reduce((acc, item) => acc + item.qty, 0));
const cartTotal = computed(() => cart.value.reduce((acc, item) => acc + (item.price * item.qty), 0));

// ------------------- ⭐️ មុខងារគណនាថ្លៃដឹកជញ្ជូនវៃឆ្លាត (Fixed) -------------------
const deliveryFeeDetails = computed(() => {
    if (!deliverySettings.value) return { fee: 0, currency: 'USD', isFree: false };
    
    const subtotal = cartTotal.value;
    const isPhnomPenh = form.city === 'ភ្នំពេញ';
    const settings = isPhnomPenh ? deliverySettings.value.phnomPenh : deliverySettings.value.provincial;
    
    if (!settings) return { fee: 0, currency: 'USD', isFree: false };

    let fee = 0;
    let isFree = false;

    // ឆែកលក្ខខណ្ឌ Has Condition
    if (settings.hasCondition === true || settings.hasCondition === 'true') {
        const minAmount = parseFloat(settings.conditionMinAmount) || 0;
        if (subtotal >= minAmount) {
            fee = 0;
            isFree = true;
        } else {
            // បើទិញមិនដល់លក្ខខណ្ឌ យកតម្លៃ amount 
            fee = parseFloat(settings.amount) || 0;
        }
    } else {
        // ⭐️ បើគ្មានលក្ខខណ្ឌ (false) គឺត្រូវយក baseFee
        // ការពារបញ្ហាលេខ 0 មិនឱ្យលោតទៅចាប់យក amount វិញ
        if (settings.baseFee !== undefined && settings.baseFee !== null && settings.baseFee !== '') {
            fee = parseFloat(settings.baseFee);
        } else {
            fee = parseFloat(settings.amount) || 0;
        }
        
        // ប្រសិនបើ Admin ដាក់ baseFee ស្មើ 0 មែន ឱ្យវាបង្ហាញពាក្យ "Free" ដែរ
        if (fee === 0) {
            isFree = true;
        }
    }

    return { fee, currency: settings.currency || 'USD', isFree };
});

const grandTotal = computed(() => cartTotal.value + deliveryFeeDetails.value.fee);

const startCheckout = () => {
  if (cartTotalQty.value === 0) return;
  showCart.value = false;
  showCheckout.value = true;
  activePendingOrderId.value = null;
  form.name = ''; form.phone = ''; form.city = 'ភ្នំពេញ'; form.province = ''; form.mapsLink = ''; form.branch = '';
};

// ------------------- មុខងារ Save & Share QR -------------------
const downloadQRImage = async () => {
    const element = document.getElementById('qr-capture-area');
    if (!element) return notify("Error", "រកមិនឃើញរូបភាព QR ទេ", "error");

    try {
        await new Promise(resolve => setTimeout(resolve, 300));
        const dataUrl = await htmlToImage.toPng(element, { quality: 1, backgroundColor: '#ffffff', pixelRatio: 3, fontEmbedCSS: '' });
        const link = document.createElement('a');
        link.download = `KHQR_${currentOrderTotal.value}$_${Date.now()}.png`;
        link.href = dataUrl;
        document.body.appendChild(link); 
        link.click();
        document.body.removeChild(link);
        notify("ជោគជ័យ", "បាន Save រូបថត QR រួចរាល់");
    } catch(e) { notify("Error", "មិនអាច Save រូបភាពបានទេ", "error"); }
};

const shareQRImage = async () => {
    const element = document.getElementById('qr-capture-area');
    if (!element) return notify("Error", "រកមិនឃើញរូបភាព QR ទេ", "error");

    if (!navigator.share || !navigator.canShare) {
        return notify("ព័ត៌មាន", "ទូរស័ព្ទរបស់អ្នកមិនគាំទ្រមុខងារ Share ទេ", "warning");
    }

    try {
        await new Promise(resolve => setTimeout(resolve, 300));
        const blob = await htmlToImage.toBlob(element, { quality: 1, backgroundColor: '#ffffff', pixelRatio: 3, fontEmbedCSS: '' });
        const file = new File([blob], `KHQR_${currentOrderTotal.value}$.png`, { type: 'image/png' });

        if (navigator.canShare({ files: [file] })) {
            await navigator.share({
                files: [file], title: 'KHQR Payment',
                text: `សូមទូទាត់ប្រាក់ចំនួន $${currentOrderTotal.value.toLocaleString('en-US', {minimumFractionDigits: 2})}`
            });
        }
    } catch (e) { if (e.name !== 'AbortError') notify("Error", "មានបញ្ហាក្នុងការ Share រូបភាព", "error"); }
};

const autoSavePendingFromQR = async () => {
    showQR.value = false;
    loading.value = true;
    try {
        if (activePendingOrderId.value) {
             notify("ព័ត៌មាន", "ផុតម៉ោង QR។ ទិន្នន័យនៅតែរក្សាទុកក្នុងរបាយការណ៍ដដែល។", "warning");
             activePendingOrderId.value = null;
             return;
        }

        const totalIncentive = cart.value.reduce((acc, item) => acc + ((item.incentiveAmount || 0) * item.qty), 0);

        const orderData = {
            items: [...cart.value],
            totalAmount: grandTotal.value, 
            subtotal: cartTotal.value,
            deliveryFee: deliveryFeeDetails.value.fee,
            customerName: form.name,
            customerPhone: form.phone,
            location: form.city === 'ភ្នំពេញ' ? 'ភ្នំពេញ' : form.province,
            transportCompany: form.city !== 'ភ្នំពេញ' ? form.transportCompany : '',
            branch: form.city !== 'ភ្នំពេញ' ? form.branch : '',
            mapsLink: form.mapsLink || '',
            sellerName: loggedInUserFullName.value, sellerRole: userRole.value,
            uid: loggedInUserId.value, createdBy: adminId.value,        
            paymentStatus: 'PENDING', paymentMethod: 'TIMEOUT_QR',
            sellerIncentive: totalIncentive,
            createdAt: new Date().toISOString()
        };

        await addDoc(collection(db, "sales_reports"), orderData);
        for (const item of cart.value) {
            const stockRef = doc(db, "stocks", item.id);
            await updateDoc(stockRef, { quantity: increment(-item.qty) });
        }
        
        fetchProducts(); fetchReports();
        notify("ព័ត៌មាន", "ផុតកំណត់។ វិក្កយបត្រត្រូវបានរក្សាទុកជា 'រង់ចាំទូទាត់' ដោយស្វ័យប្រវត្តិ។", "warning");
        cart.value = []; currentHash.value = '';
    } catch(e) { notify("Error", "មានបញ្ហាក្នុងការរក្សាទុក", "error"); } 
    finally { loading.value = false; }
};

const processPendingOrder = async () => {
  if(!form.name || !form.phone) return notify("Error", "សូមបញ្ចូលឈ្មោះ និងលេខទូរស័ព្ទ", "error");
  loading.value = true;
  try {
      const totalIncentive = cart.value.reduce((acc, item) => acc + ((item.incentiveAmount || 0) * item.qty), 0);

      const orderData = {
          items: [...cart.value], 
          totalAmount: grandTotal.value,
          subtotal: cartTotal.value,
          deliveryFee: deliveryFeeDetails.value.fee,
          customerName: form.name, customerPhone: form.phone,
          location: 'ភ្នំពេញ (COD)', mapsLink: form.mapsLink,
          sellerName: loggedInUserFullName.value, sellerRole: userRole.value,
          uid: loggedInUserId.value, createdBy: adminId.value,        
          paymentStatus: 'PENDING', paymentMethod: 'COD',
          sellerIncentive: totalIncentive,
          createdAt: new Date().toISOString()
      };

      const docRef = await addDoc(collection(db, "sales_reports"), orderData);
      for (const item of cart.value) {
          const stockRef = doc(db, "stocks", item.id);
          await updateDoc(stockRef, { quantity: increment(-item.qty) });
      }
      
      showCheckout.value = false;
      currentInvoice.value = { id: docRef.id, ...orderData };
      showInvoice.value = true;
      fetchProducts(); fetchReports();
      notify("ជោគជ័យ", "បានរក្សាទុករង់ចាំការទូទាត់ (COD)");
      cart.value = [];
  } catch(e) { notify("Error", "មានបញ្ហាក្នុងការរក្សាទុក", "error"); } 
  finally { loading.value = false; }
};

const processOrder = async () => {
  if(!form.name || !form.phone || !form.province) return notify("Error", "សូមបញ្ចូលព័ត៌មានឱ្យបានគ្រប់គ្រាន់", "error");
  loading.value = true;
  currentOrderTotal.value = grandTotal.value;
  activePendingOrderId.value = null; 
  try {
      const payload = {
          customer: { name: form.name, phone: form.phone, address: `${form.province} - ${form.transportCompany} (${form.branch})` }, 
          cart: cart.value,
          seller: { 
              name: loggedInUserFullName.value, role: userRole.value, adminName: adminName.value,
              uid: loggedInUserId.value, createdBy: adminId.value
          }
      };
      
      const res = await fetch(`${API_URL}/api/create-order`, {
          method: "POST", headers: { "Content-Type": "application/json" }, 
          body: JSON.stringify({ ...payload, finalTotal: grandTotal.value }) 
      });
      const data = await res.json();
      if(data.qrString) {
          showCheckout.value = false; showQR.value = true;
          currentHash.value = data.md5;
          currentMerchantId.value = data.merchantId;
          currentMerchantName.value = data.merchantName;
          
          startCountdown(); 
          setTimeout(() => {
              const qr = qrcode(0, "M"); qr.addData(data.qrString); qr.make();
              document.getElementById("qrcode").innerHTML = qr.createImgTag(6, 10);
          }, 100);
          startPolling(data.md5);
      }
  } catch(e) { notify("Error", "Server មិនដំណើរការ", "error"); } 
  finally { loading.value = false; }
};

const handleSuccess = async () => {
  if (!currentHash.value) return; 
  currentHash.value = ''; 

  clearInterval(pollTimer); clearInterval(timerInterval);
  showQR.value = false;

  if (activePendingOrderId.value) {
      try {
          const reportRef = doc(db, "sales_reports", activePendingOrderId.value);
          await updateDoc(reportRef, { paymentStatus: 'PAID', paymentMethod: 'KHQR' });
          
          const updatedReport = reports.value.find(r => r.id === activePendingOrderId.value);
          if(updatedReport) {
              updatedReport.paymentStatus = 'PAID';
              currentInvoice.value = updatedReport;
              showInvoice.value = true;
          }
          fetchReports();
          notify("ជោគជ័យ", "វិក្កយបត្រត្រូវបានទូទាត់រួចរាល់!");
          activePendingOrderId.value = null;
      } catch (e) { notify("Error", "មានបញ្ហាក្នុងការ Update", "error"); }
  } 
  else if (cart.value.length > 0) {
      try {
          const totalIncentive = cart.value.reduce((acc, item) => acc + ((item.incentiveAmount || 0) * item.qty), 0);

          const orderData = {
              items: [...cart.value], 
              totalAmount: grandTotal.value,
              subtotal: cartTotal.value,
              deliveryFee: deliveryFeeDetails.value.fee,
              customerName: form.name, customerPhone: form.phone,
              location: form.city === 'ភ្នំពេញ' ? 'ភ្នំពេញ' : form.province,
              transportCompany: form.city !== 'ភ្នំពេញ' ? form.transportCompany : '',
              branch: form.city !== 'ភ្នំពេញ' ? form.branch : '',
              sellerName: loggedInUserFullName.value, sellerRole: userRole.value,
              uid: loggedInUserId.value, createdBy: adminId.value,        
              paymentStatus: 'PAID', paymentMethod: 'KHQR',
              sellerIncentive: totalIncentive,
              createdAt: new Date().toISOString()
          };

          const docRef = await addDoc(collection(db, "sales_reports"), orderData);
          for (const item of cart.value) {
              const stockRef = doc(db, "stocks", item.id);
              await updateDoc(stockRef, { quantity: increment(-item.qty) });
          }
          
          currentInvoice.value = { id: docRef.id, ...orderData };
          showInvoice.value = true;
          fetchProducts(); fetchReports(); 
          notify("ជោគជ័យ", "ការទូទាត់ប្រាក់ទទួលបានជោគជ័យ!");
      } catch (error) { notify("Warning", "លុយទទួលបានហើយ តែមានបញ្ហាក្នុងការកាត់ស្តុក", "error"); }
      cart.value = []; 
  }
};

const cancelPayment = () => { showQR.value = false; clearInterval(pollTimer); clearInterval(timerInterval); currentHash.value = ''; };

const fetchReports = async () => {
  if (!db) return;
  isLoadingReports.value = true;
  try {
      const q = query(collection(db, "sales_reports"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const fetchedData = [];
      querySnapshot.forEach((doc) => { fetchedData.push({ id: doc.id, ...doc.data() }); });
      reports.value = fetchedData;
  } catch (error) { console.error(error); } 
  finally { isLoadingReports.value = false; }
};

const filteredReports = computed(() => {
  const now = new Date();
  return reports.value.filter(report => {
      if (filterType.value === 'all') return true;
      const reportDate = new Date(report.createdAt);
      if (filterType.value === 'today') return reportDate.toDateString() === now.toDateString();
      if (filterType.value === 'month') return reportDate.getMonth() === now.getMonth() && reportDate.getFullYear() === now.getFullYear();
      if (filterType.value === 'year') return reportDate.getFullYear() === now.getFullYear();
      return true;
  });
});

const totalRevenue = computed(() => filteredReports.value.reduce((sum, r) => r.paymentStatus === 'PAID' ? sum + (Number(r.totalAmount) || 0) : sum, 0));
const pendingOrdersCount = computed(() => filteredReports.value.filter(r => r.paymentStatus === 'PENDING').length);

const cancelPendingOrder = async (report) => {
  if(!confirm("តើអ្នកពិតជាចង់លុបចោលវិក្កយបត្រនេះមែនទេ? (ស្តុកនឹងត្រូវបូកបញ្ចូលវិញ)")) return;
  try {
      const reportRef = doc(db, "sales_reports", report.id);
      await updateDoc(reportRef, { paymentStatus: 'CANCELLED' });
      for (const item of report.items) {
          const stockRef = doc(db, "stocks", item.id);
          await updateDoc(stockRef, { quantity: increment(item.qty) });
      }
      fetchProducts(); fetchReports();
      notify("ជោគជ័យ", "វិក្កយបត្រត្រូវបានលុបចោល និងបង្វិលស្តុកវិញ!");
  } catch(e) { notify("Error", "មិនអាចលុបចោលបានទេ", "error"); }
};

const openPayPendingModal = (report) => {
  pendingOrderToPay.value = report;
  pendingCashAmount.value = report.totalAmount;
  pendingCashNote.value = '';
  
  if (report.location && !report.location.includes('ភ្នំពេញ')) {
      pendingPayMethod.value = 'qr';
  } else {
      pendingPayMethod.value = 'qr'; 
  }
  showPendingPayModal.value = true;
};

const openEditModal = (report) => {
    editForm.id = report.id;
    editForm.name = report.customerName || '';
    editForm.phone = report.customerPhone || '';
    editForm.location = report.location || '';
    editForm.transportCompany = report.transportCompany || '';
    editForm.branch = report.branch || '';
    showEditModal.value = true;
};

const saveEditOrder = async () => {
    if(!editForm.name || !editForm.phone || !editForm.location) return notify("Error", "សូមបញ្ចូលព័ត៌មានអោយគ្រប់", "error");
    loading.value = true;
    try {
        const reportRef = doc(db, "sales_reports", editForm.id);
        await updateDoc(reportRef, {
            customerName: editForm.name,
            customerPhone: editForm.phone,
            location: editForm.location,
            transportCompany: editForm.transportCompany,
            branch: editForm.branch
        });
        showEditModal.value = false;
        fetchReports();
        notify("ជោគជ័យ", "ព័ត៌មានត្រូវបានកែប្រែរួចរាល់!");
    } catch(e) {
        notify("Error", "បរាជ័យក្នុងការកែប្រែ", "error");
    } finally {
        loading.value = false;
    }
};

const confirmPendingPayment = async () => {
  if (pendingPayMethod.value === 'cash') {
      loading.value = true;
      try {
          const reportRef = doc(db, "sales_reports", pendingOrderToPay.value.id);
          await updateDoc(reportRef, { 
              paymentStatus: 'PAID', paymentMethod: 'CASH',
              cashNote: pendingCashNote.value, receivedAmount: pendingCashAmount.value
          });
          
          const updatedReport = reports.value.find(r => r.id === pendingOrderToPay.value.id);
          if(updatedReport) {
              updatedReport.paymentStatus = 'PAID';
              currentInvoice.value = updatedReport;
              showInvoice.value = true;
          }

          showPendingPayModal.value = false;
          pendingOrderToPay.value = null;
          fetchReports();
          notify("ជោគជ័យ", "ទទួលបានប្រាក់សុទ្ធជោគជ័យ!");
      } catch(e) { notify("Error", "មានបញ្ហាក្នុងការ Update", "error"); }
      finally { loading.value = false; }
  } 
  else if (pendingPayMethod.value === 'qr') {
      loading.value = true;
      currentOrderTotal.value = pendingOrderToPay.value.totalAmount;
      activePendingOrderId.value = pendingOrderToPay.value.id; 
      try {
          const payload = {
              customer: { name: pendingOrderToPay.value.customerName, phone: pendingOrderToPay.value.customerPhone }, 
              cart: pendingOrderToPay.value.items,
              seller: { 
                  name: loggedInUserFullName.value, role: userRole.value, adminName: adminName.value,
                  uid: loggedInUserId.value, createdBy: adminId.value
              }
          };
          const res = await fetch(`${API_URL}/api/create-order`, {
              method: "POST", headers: { "Content-Type": "application/json" }, 
              body: JSON.stringify({ ...payload, finalTotal: pendingOrderToPay.value.totalAmount })
          });
          const data = await res.json();
          if(data.qrString) {
              showPendingPayModal.value = false; showQR.value = true;
              currentHash.value = data.md5;
              currentMerchantId.value = data.merchantId;
              currentMerchantName.value = data.merchantName;
              
              startCountdown();
              setTimeout(() => {
                  const qr = qrcode(0, "M"); qr.addData(data.qrString); qr.make();
                  document.getElementById("qrcode").innerHTML = qr.createImgTag(6, 10);
              }, 100);
              startPolling(data.md5);
          }
      } catch(e) { notify("Error", "Server មិនដំណើរការ", "error"); } 
      finally { loading.value = false; }
  }
};

const viewInvoice = (report) => {
    currentInvoice.value = report;
    showInvoice.value = true;
};

const closeInvoice = () => { showInvoice.value = false; currentInvoice.value = null; };
const printInvoice = () => { window.print(); };

const downloadInvoiceImage = async () => {
  const element = document.getElementById('invoice-capture');
  if(!element) return;
  
  try {
      const dataUrl = await htmlToImage.toPng(element, { quality: 1, backgroundColor: '#ffffff', pixelRatio: 3, fontEmbedCSS: '' });
      const link = document.createElement('a');
      link.download = `Invoice-${currentInvoice.value.customerName}-${Date.now()}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      notify("ជោគជ័យ", "បាន Save វិក្កយបត្ររួចរាល់");
  } catch(e) { notify("Error", "មិនអាច Download រូបភាពបានទេ", "error"); }
};

const formatTime = (s) => `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`;
const formatDate = (isoString) => new Date(isoString).toLocaleDateString('km-KH', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

const startCountdown = () => {
  qrTimeLeft.value = 330; 
  let totalSeconds = 330;

  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
      totalSeconds--;
      qrTimeLeft.value = totalSeconds;
      if (totalSeconds <= 0) { 
          clearInterval(timerInterval);
          clearInterval(pollTimer);
          autoSavePendingFromQR(); 
      }
  }, 1000);
};

const startPolling = (md5) => {
  pollTimer = setInterval(async () => {
      try {
          const res = await fetch(`${API_URL}/api/check-status`, {
              method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ md5 })
          });
          const d = await res.json();
          if(d.status === "success") handleSuccess();
      } catch {}
  }, 3000);
};
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 5px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
</style>