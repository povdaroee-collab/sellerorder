<template>
  <div class="bg-slate-900 min-h-screen flex items-center justify-center relative overflow-hidden">
      <div class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-30"></div>
      <div class="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-slate-900/95 to-slate-900"></div>
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-pulse" style="animation-delay: 2s;"></div>

      <div class="relative z-10 w-full max-w-md p-6">
          <div class="bg-white/10 backdrop-blur-md p-10 rounded-[2.5rem] shadow-2xl border border-white/20">
              <div class="text-center mb-10">
                  <div class="w-16 h-16 bg-gradient-to-tr from-blue-600 to-teal-400 rounded-2xl flex items-center justify-center text-white text-3xl font-black shadow-lg mx-auto mb-4 transform rotate-3">S</div>
                  <h2 class="text-3xl font-black text-white tracking-tight">Welcome Back</h2>
                  <p class="text-slate-400 text-sm mt-2">Sign in to Sokpheak POS System</p>
              </div>

              <form @submit.prevent="handleLogin" class="space-y-5">
                  <div class="space-y-1.5">
                      <div class="relative">
                          <i class="ph-fill ph-user absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg"></i>
                          <input v-model="form.username" type="text" required
                              class="w-full bg-slate-800/50 border border-slate-700 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-blue-500 focus:bg-slate-800 outline-none transition text-white" 
                              placeholder="Username">
                      </div>
                  </div>

                  <div class="space-y-1.5">
                      <div class="relative">
                          <i class="ph-fill ph-lock-key absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg"></i>
                          <input v-model="form.password" type="password" required
                              class="w-full bg-slate-800/50 border border-slate-700 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-blue-500 focus:bg-slate-800 outline-none transition text-white" 
                              placeholder="••••••••">
                      </div>
                  </div>

                  <div v-if="errorMessage" class="p-3 bg-red-500/20 border border-red-500/50 rounded-xl flex items-center gap-2 text-red-200 text-sm font-medium">
                      <i class="ph-fill ph-warning-circle text-lg"></i> {{ errorMessage }}
                  </div>

                  <button type="submit" :disabled="loading" 
                      class="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-500 transition-all shadow-lg flex items-center justify-center gap-2 mt-4">
                      <span v-if="loading" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      <span v-else>Access System <i class="ph-bold ph-arrow-right"></i></span>
                  </button>
              </form>
          </div>
      </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { db, collection, query, where, getDocs } from '../firebase'; 

const router = useRouter();
const form = ref({ username: '', password: '' });
const loading = ref(false);
const errorMessage = ref('');

const handleLogin = async () => {
  loading.value = true;
  errorMessage.value = '';

  const inputUsername = form.value.username.trim();
  const inputPassword = form.value.password.trim();

  console.log("👉 កំពុងស្វែងរក:", `[${inputUsername}]`, `[${inputPassword}]`);

  try {
      const userRef = collection(db, "users");
      
      // 🛠️ DEBUG MODE: សាកល្បងទាញយកទិន្នន័យទាំងអស់សិន
      const allUsersSnapshot = await getDocs(userRef);
      console.log(`📊 រកឃើញចំនួន User ទាំងអស់: ${allUsersSnapshot.size} នាក់`);
      allUsersSnapshot.forEach(doc => {
          console.log("👤 User ក្នុង DB មាន:", doc.data().username, "| Password:", doc.data().password);
      });
      // ---------------------------------------------------------

      const q = query(
          userRef, 
          where("username", "==", inputUsername), 
          where("password", "==", inputPassword)
      );
      
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          const userData = userDoc.data();
          
          localStorage.setItem('dpos_session', JSON.stringify({
              fullName: userData.fullName || userData.username,
              role: userData.role || 'seller',
              photoUrl: userData.photoUrl || '',
              adminName: userData.adminName || 'Admin',
              uid: userData.uid || userDoc.id,
              createdBy: userData.createdBy || ''
          }));
          
          router.push('/');
      } else {
          errorMessage.value = "គណនីមិនត្រឹមត្រូវ! សូមពិនិត្យម្ដងទៀត។";
      }
  } catch (error) { 
      console.error("🔥 Error Firebase:", error); 
      errorMessage.value = "មានបញ្ហាក្នុងការភ្ជាប់ទៅកាន់ Database។";
  } 
  finally { 
      loading.value = false; 
  }
};
</script>