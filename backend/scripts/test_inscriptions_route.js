const TALENT_DAY_ID = '691b20bdf478e76354626456'; // TalentDay #3 avec 3 inscriptions

async function testRoute() {
  try {
    // Login d'abord
    console.log(' Login admin...');
    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@admin.com',
        password: 'Admin123456'
      })
    });
    
    const loginData = await loginResponse.json();
    const token = loginData.token;
    console.log(' Token obtenu\n');
    
    // Test route inscriptions
    console.log(` Test GET /api/talent-days/${TALENT_DAY_ID}/inscriptions`);
    const inscriptionsResponse = await fetch(
      `http://localhost:5000/api/talent-days/${TALENT_DAY_ID}/inscriptions`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    const inscriptionsData = await inscriptionsResponse.json();
    
    console.log(' Réponse reçue:');
    console.log('   Status:', inscriptionsResponse.status);
    console.log('   Success:', inscriptionsData.success);
    console.log('   Message:', inscriptionsData.message);
    console.log('   Count:', inscriptionsData.count);
    console.log('   Inscriptions:', inscriptionsData.data?.length || 0);
    console.log('\n Réponse complète:', JSON.stringify(inscriptionsData, null, 2));
    
    if (inscriptionsData.data?.length > 0) {
      console.log('\n Premiers inscrits:');
      inscriptionsData.data.slice(0, 2).forEach((ins, idx) => {
        console.log(`   ${idx + 1}. ${ins.nom} (${ins.email})`);
      });
    }
    
  } catch (error) {
    console.error(' Erreur:', error.message);
  }
}

testRoute();
