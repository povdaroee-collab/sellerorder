<template>
  <div class="max-w-7xl mx-auto font-['Noto_Serif_Khmer'] pb-20">
    
    <div class="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
            <h2 class="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">គណនីរបស់ខ្ញុំ</h2>
            <p class="text-slate-500 text-sm mt-1">ព័ត៌មានលម្អិត និងរបាយការណ៍ប្រាក់លើកទឹកចិត្ត</p>
        </div>
    </div>

    <div v-if="loading" class="text-center py-20 text-slate-400 bg-white rounded-3xl shadow-sm border border-slate-100">
        <i class="ph-bold ph-spinner animate-spin text-4xl text-blue-500 mb-3 mx-auto"></i>
        <p>កំពុងទាញយកទិន្នន័យ...</p>
    </div>

    <div v-else class="space-y-8">
        
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center text-center relative overflow-hidden">
                <div class="absolute top-0 left-0 w-full h-28 bg-gradient-to-br from-blue-500 to-indigo-600 opacity-90"></div>
                
                <div class="w-24 h-24 rounded-full border-4 border-white shadow-xl overflow-hidden bg-slate-50 relative z-10 mt-8 mb-4">
                    <img v-if="userInfo.photoUrl" :src="userInfo.photoUrl" class="w-full h-full object-cover">
                    <i v-else class="ph-fill ph-user text-5xl text-slate-300 mt-4"></i>
                </div>
                
                <h3 class="text-xl font-black text-slate-900">{{ userInfo.fullName || userInfo.username }}</h3>
                <span class="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mt-2 mb-6 shadow-sm border border-blue-100">{{ userInfo.role }}</span>
                
                <div class="w-full pt-4 border-t border-slate-100 flex flex-col gap-3 text-sm text-slate-600 bg-slate-50/50 rounded-2xl p-4">
                    <div class="flex justify-between items-center">
                        <span class="font-medium text-slate-500">អ្នកបង្កើតគណនី:</span>
                        <span class="font-bold text-slate-900 flex items-center gap-1.5 bg-white px-2 py-1 rounded-lg border border-slate-200">
                            <i class="ph-fill ph-user-gear text-blue-500"></i> {{ adminFullName }}
                        </span>
                    </div>
                    <div class="flex justify-between items-center text-left">
                        <span class="font-medium text-slate-500">ថ្ងៃបង្កើត:</span>
                        <span class="font-bold text-slate-900 text-[13px] bg-white px-2 py-1 rounded-lg border border-slate-200">{{ formatDisplayDate(userInfo.createdAt) }}</span>
                    </div>
                </div>
            </div>

            <div class="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm lg:col-span-2 flex flex-col justify-center">
                <h3 class="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
                    <div class="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center"><i class="ph-fill ph-identification-card text-xl"></i></div>
                    ព័ត៌មានទំនាក់ទំនងលម្អិត
                </h3>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                    <div class="space-y-1">
                        <label class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">ឈ្មោះចូលប្រើ (Username)</label>
                        <p class="font-bold text-slate-900 text-base">{{ userInfo.username || 'N/A' }}</p>
                    </div>
                    <div class="space-y-1">
                        <label class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">លេខទូរស័ព្ទ</label>
                        <p class="font-bold text-slate-900 text-base flex items-center gap-2"><i class="ph-fill ph-phone text-slate-400"></i> {{ userInfo.phoneNumber || 'មិនបានបញ្ជាក់' }}</p>
                    </div>
                    <div class="space-y-1">
                        <label class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Telegram</label>
                        <p class="font-bold text-slate-900 text-base flex items-center gap-2"><i class="ph-fill ph-telegram-logo text-blue-500"></i> {{ userInfo.telegram || 'មិនបានបញ្ជាក់' }}</p>
                    </div>
                    <div class="space-y-1">
                        <label class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">លេខអត្តសញ្ញាណប័ណ្ណ</label>
                        <p class="font-bold text-slate-900 text-base">{{ userInfo.idNumber || 'មិនបានបញ្ជាក់' }}</p>
                    </div>
                    <div class="space-y-1 md:col-span-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <label class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">អាសយដ្ឋានបច្ចុប្បន្ន</label>
                        <p class="font-bold text-slate-900 flex items-start gap-2 mt-1.5"><i class="ph-fill ph-map-pin text-red-500 text-lg mt-0.5"></i> {{ userInfo.address || 'មិនបានបញ្ជាក់' }}</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4 mt-10">
            <h3 class="text-xl font-black text-slate-800 flex items-center gap-2">
                <div class="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center"><i class="ph-fill ph-wallet text-xl"></i></div>
                របាយការណ៍ប្រាក់លើកទឹកចិត្ត
            </h3>
            
            <div class="w-full lg:w-auto bg-white p-1.5 rounded-xl shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-1.5">
                <div class="flex gap-1.5 flex-1">
                    <button @click="setFilter('today')" :class="filterType === 'today' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'" class="px-4 py-2 rounded-lg text-sm font-bold transition flex-1 sm:flex-none text-center">ថ្ងៃនេះ</button>
                    <button @click="setFilter('month')" :class="filterType === 'month' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'" class="px-4 py-2 rounded-lg text-sm font-bold transition flex-1 sm:flex-none text-center">ខែនេះ</button>
                    <button @click="setFilter('all')" :class="filterType === 'all' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'" class="px-4 py-2 rounded-lg text-sm font-bold transition flex-1 sm:flex-none text-center">ទាំងអស់</button>
                </div>
                <div class="flex items-center gap-1.5 border-t sm:border-t-0 sm:border-l border-slate-100 pt-2 sm:pt-0 sm:pl-2">
                    <input type="date" v-model="startDate" @change="setFilter('custom')" class="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg px-2 py-2 outline-none focus:border-blue-500">
                    <span class="text-slate-400 text-xs">-</span>
                    <input type="date" v-model="endDate" @change="setFilter('custom')" class="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg px-2 py-2 outline-none focus:border-blue-500">
                </div>
            </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            <div class="bg-gradient-to-br from-green-500 to-teal-600 p-8 rounded-3xl shadow-lg shadow-green-500/20 text-white relative overflow-hidden flex items-center">
                <i class="ph-fill ph-money text-8xl opacity-10 absolute -right-4 -bottom-4 transform -rotate-12"></i>
                <div class="relative z-10 w-full">
                    <p class="text-sm font-medium text-green-100 mb-1 tracking-wide">ប្រាក់លើកទឹកចិត្តសរុប (Filtered)</p>
                    <h3 class="text-4xl md:text-5xl font-black">${{ totalIncentive.toLocaleString('en-US', {minimumFractionDigits: 2}) }}</h3>
                </div>
            </div>
            <div class="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-6 relative overflow-hidden">
                <div class="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-4xl shrink-0"><i class="ph-fill ph-shopping-bag-open"></i></div>
                <div>
                    <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">វិក្កយបត្រដែលលក់ដាច់</p>
                    <h3 class="text-3xl font-black text-slate-900">{{ paidSalesCount }} <span class="text-lg font-bold text-slate-500">វិក្កយបត្រ</span></h3>
                </div>
            </div>
        </div>

        <div class="bg-white md:rounded-3xl border border-slate-100 shadow-sm overflow-hidden mt-6">
            <div class="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <h3 class="font-bold text-slate-800">ប្រវត្តិលក់លម្អិត (ទូទាត់រួច)</h3>
            </div>

            <div class="md:hidden flex flex-col gap-3 p-4 bg-slate-50/30">
                <div v-if="filteredPaidSales.length === 0" class="text-center py-10 text-slate-400 bg-white rounded-2xl border border-slate-100">
                    <i class="ph-fill ph-receipt text-4xl mb-2 text-slate-300"></i>
                    <p>មិនមានទិន្នន័យទេ</p>
                </div>
                
                <div v-for="sale in filteredPaidSales" :key="sale.id" class="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-3 relative overflow-hidden">
                    <div class="absolute top-0 left-0 w-1 h-full" :class="sale.paymentMethod === 'KHQR' ? 'bg-blue-500' : 'bg-green-500'"></div>
                    
                    <div class="flex justify-between items-start pl-2">
                        <div>
                            <div class="font-black text-slate-900 text-sm flex items-center gap-1.5"><i class="ph-fill ph-user text-slate-400"></i> {{ sale.customerName }}</div>
                            <div class="text-[11px] text-slate-500 mt-1 flex items-center gap-1"><i class="ph-bold ph-clock"></i> {{ formatDisplayDate(sale.createdAt, true) }}</div>
                        </div>
                        <span class="bg-green-50 text-green-700 text-xs font-black px-2.5 py-1 rounded-lg border border-green-100">
                            + ${{ (Number(sale.sellerIncentive) || 0).toLocaleString('en-US', {minimumFractionDigits: 2}) }}
                        </span>
                    </div>

                    <div class="flex justify-between items-end border-t border-slate-50 pt-3 pl-2">
                        <div>
                            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">ទូទាត់តាម</span>
                            <span class="text-xs font-bold" :class="sale.paymentMethod === 'KHQR' ? 'text-blue-600' : 'text-green-600'">{{ sale.paymentMethod }}</span>
                        </div>
                        <div class="flex gap-2">
                            <button @click="openInvoiceModal(sale)" class="bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5">
                                <i class="ph-bold ph-printer"></i> វិក្កយបត្រ
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="hidden md:block overflow-x-auto">
                <table class="w-full text-sm text-left">
                    <thead class="text-[11px] text-slate-500 bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th class="px-6 py-4 font-bold uppercase tracking-wider rounded-tl-3xl">កាលបរិច្ឆេទ</th>
                            <th class="px-6 py-4 font-bold uppercase tracking-wider">អតិថិជន</th>
                            <th class="px-6 py-4 font-bold uppercase tracking-wider">វិធីទូទាត់</th>
                            <th class="px-6 py-4 font-bold uppercase tracking-wider text-right">Incentive</th>
                            <th class="px-6 py-4 font-bold uppercase tracking-wider text-center">សកម្មភាព</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-50">
                        <tr v-if="filteredPaidSales.length === 0">
                            <td colspan="5" class="px-6 py-12 text-center text-slate-400">
                                <i class="ph-fill ph-receipt text-5xl mb-3 text-slate-200 block"></i>
                                មិនមានទិន្នន័យសម្រាប់ជម្រើសនេះទេ
                            </td>
                        </tr>
                        <tr v-for="sale in filteredPaidSales" :key="sale.id" class="hover:bg-blue-50/30 transition-colors group">
                            <td class="px-6 py-4 font-medium text-slate-600">{{ formatDisplayDate(sale.createdAt, true) }}</td>
                            <td class="px-6 py-4 font-bold text-slate-900">{{ sale.customerName }}</td>
                            <td class="px-6 py-4">
                                <span class="px-2.5 py-1 rounded-md text-[10px] font-bold border" :class="sale.paymentMethod === 'KHQR' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-green-50 text-green-600 border-green-100'">
                                    {{ sale.paymentMethod }}
                                </span>
                            </td>
                            <td class="px-6 py-4 font-black text-green-600 text-right">+ ${{ (Number(sale.sellerIncentive) || 0).toLocaleString('en-US', {minimumFractionDigits: 2}) }}</td>
                            <td class="px-6 py-4 text-center">
                                <button @click="openInvoiceModal(sale)" class="opacity-0 group-hover:opacity-100 bg-white border border-slate-200 hover:border-blue-400 hover:text-blue-600 text-slate-500 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 mx-auto">
                                    <i class="ph-bold ph-printer text-sm"></i> Print / Save
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <div v-if="showInvoice" class="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/85 backdrop-blur-sm">
        <div class="relative w-full max-w-md flex flex-col h-full md:h-auto max-h-[90vh]">
            
            <div class="flex justify-between items-center mb-4 no-print shrink-0 bg-white/10 p-2 rounded-2xl backdrop-blur border border-white/20">
                <button @click="showInvoice = false" class="w-10 h-10 bg-white/20 hover:bg-white/40 rounded-full text-white flex items-center justify-center transition"><i class="ph-bold ph-x text-xl"></i></button>
                <div class="flex gap-2">
                    <button @click="downloadInvoice" class="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl flex items-center gap-2 transition shadow-lg"><i class="ph-bold ph-download-simple"></i> Save រូបថត</button>
                    <button @click="printInvoice" class="px-4 py-2.5 bg-white text-slate-800 text-sm font-bold rounded-xl flex items-center gap-2 hover:bg-slate-100 transition shadow-lg"><i class="ph-bold ph-printer"></i> Print</button>
                </div>
            </div>

            <div id="invoice-capture-account" class="bg-white rounded-[2rem] shadow-2xl overflow-y-auto flex-1 p-6 md:p-8 text-slate-800 relative">
                <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none rotate-[-30deg]">
                    <span class="text-6xl font-black text-slate-900 border-8 border-slate-900 px-6 py-2 rounded-3xl uppercase tracking-widest">PAID</span>
                </div>

                <div class="text-center mb-6 border-b border-slate-100 pb-6">
                    <div class="w-14 h-14 bg-slate-900 rounded-xl flex items-center justify-center text-white text-2xl font-black mx-auto mb-3 shadow-md">S</div>
                    <h2 class="text-xl font-black tracking-widest">វិក្កយបត្រ (INVOICE)</h2>
                    <p class="text-xs text-slate-500 mt-1">កាលបរិច្ឆេទ: {{ formatDisplayDate(currentInvoice.createdAt, true) }}</p>
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

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { db, collection, getDocs, query, where } from '../firebase';
import html2canvas from 'html2canvas';

const loading = ref(true);
const userInfo = ref({});
const userSales = ref([]);
const adminFullName = ref('កំពុងស្វែងរក...');

// ⭐️ អថេរសម្រាប់មុខងារ Filter
const filterType = ref('all');
const startDate = ref('');
const endDate = ref('');

// ⭐️ អថេរសម្រាប់ Invoice Modal
const showInvoice = ref(false);
const currentInvoice = ref(null);

onMounted(async () => {
    const storedSession = localStorage.getItem('dpos_session');
    if (!storedSession) {
        loading.value = false;
        return;
    }
    
    const sessionData = JSON.parse(storedSession);
    const currentUid = sessionData.uid;

    if (!currentUid) {
        loading.value = false;
        return;
    }

    try {
        // ទាញយកព័ត៌មានលម្អិតរបស់ Seller 
        const usersRef = collection(db, "users");
        const qUser = query(usersRef, where("uid", "==", currentUid));
        const userSnap = await getDocs(qUser);
        
        if (!userSnap.empty) {
            userInfo.value = userSnap.docs[0].data();

            // ស្វែងរកឈ្មោះ Admin ដោយប្រើ createdBy
            if (userInfo.value.createdBy) {
                const adminId = userInfo.value.createdBy;
                const qAdmin = query(usersRef, where("uid", "==", adminId));
                const adminSnap = await getDocs(qAdmin);
                
                if (!adminSnap.empty) {
                    adminFullName.value = adminSnap.docs[0].data().fullName || adminSnap.docs[0].data().username;
                } else {
                    adminFullName.value = "មិនស្គាល់ Admin";
                }
            } else {
                adminFullName.value = "មិនមានអ្នកបង្កើត";
            }
        }

        // ទាញយកប្រវត្តិលក់ (Sales) របស់ Seller នេះ
        const salesRef = collection(db, "sales_reports");
        const qSales = query(salesRef, where("uid", "==", currentUid));
        const salesSnap = await getDocs(qSales);
        
        const fetchedSales = [];
        salesSnap.forEach(doc => {
            fetchedSales.push({ id: doc.id, ...doc.data() });
        });
        
        // តម្រៀបពីថ្មីទៅចាស់
        userSales.value = fetchedSales.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    } catch (error) {
        console.error("Error fetching account data:", error);
    } finally {
        loading.value = false;
    }
});

// ------------------- ⭐️ មុខងារ Smart Filter -------------------
const setFilter = (type) => {
    filterType.value = type;
    if (type !== 'custom') {
        startDate.value = '';
        endDate.value = '';
    }
};

const filteredPaidSales = computed(() => {
    let paidOnly = userSales.value.filter(sale => sale.paymentStatus === 'PAID');
    const now = new Date();

    if (filterType.value === 'today') {
        return paidOnly.filter(sale => {
            const d = new Date(sale.createdAt);
            return d.toDateString() === now.toDateString();
        });
    } 
    else if (filterType.value === 'month') {
        return paidOnly.filter(sale => {
            const d = new Date(sale.createdAt);
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        });
    } 
    else if (filterType.value === 'custom' && startDate.value && endDate.value) {
        const start = new Date(startDate.value);
        start.setHours(0,0,0,0);
        const end = new Date(endDate.value);
        end.setHours(23,59,59,999);
        
        return paidOnly.filter(sale => {
            const d = new Date(sale.createdAt);
            return d >= start && d <= end;
        });
    }
    
    return paidOnly; // 'all' condition
});

// គណនាសរុបដោយផ្អែកលើ Filter
const paidSalesCount = computed(() => filteredPaidSales.value.length);
const totalIncentive = computed(() => {
    return filteredPaidSales.value.reduce((sum, sale) => sum + (Number(sale.sellerIncentive) || 0), 0);
});


// ------------------- ⭐️ មុខងារ Print និង Save វិក្កយបត្រ -------------------
const openInvoiceModal = (sale) => {
    currentInvoice.value = sale;
    showInvoice.value = true;
};

const closeInvoice = () => {
    showInvoice.value = false;
    currentInvoice.value = null;
};

const printInvoice = () => {
    window.print();
};

const downloadInvoice = async () => {
    const element = document.getElementById('invoice-capture-account');
    if(element) {
        try {
            const canvas = await html2canvas(element, { scale: 3, useCORS: true, backgroundColor: '#ffffff' });
            const link = document.createElement('a');
            link.download = `Invoice_History_${currentInvoice.value.customerName}_${Date.now()}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch(e) { 
            alert("មិនអាច Download រូបភាពបានទេ!"); 
        }
    }
};

// ------------------- Function បំប្លែងកាលបរិច្ឆេទ -------------------
const formatDisplayDate = (timestamp, includeTime = false) => {
    if (!timestamp) return 'N/A';
    let d;
    if (timestamp && typeof timestamp.seconds === 'number') {
        d = new Date(timestamp.seconds * 1000);
    } else if (typeof timestamp === 'string' && timestamp.includes('seconds=')) {
        const match = timestamp.match(/seconds=(\d+)/);
        if (match && match[1]) {
            d = new Date(parseInt(match[1]) * 1000);
        } else {
            d = new Date(timestamp);
        }
    } else {
        d = new Date(timestamp);
    }

    if (isNaN(d.getTime())) return timestamp.toString();

    const khmerMonths = ['មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា', 'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'];
    const day = d.getDate().toString().padStart(2, '0');
    const month = khmerMonths[d.getMonth()];
    const year = d.getFullYear();
    let formatted = `${day}-${month}-${year}`;

    if (includeTime) {
        let hours = d.getHours();
        const minutes = d.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; 
        formatted += ` ${hours}:${minutes} ${ampm}`;
    }
    return formatted;
};
</script>