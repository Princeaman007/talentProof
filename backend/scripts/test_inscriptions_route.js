const TALENT_DAY_ID = '691b20bdf478e76354626456'; // TalentDay #3 avec 3 inscriptions

async function testRoute() {
  try {
    // Login d'abord
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
    
    // Test route inscriptions
    const inscriptionsResponse = await fetch(
      `http://localhost:5000/api/talent-days/${TALENT_DAY_ID}/inscriptions`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    const inscriptionsData = await inscriptionsResponse.json();
    
    
    if (inscriptionsData.data?.length > 0) {
      inscriptionsData.data.slice(0, 2).forEach((ins, idx) => {
      });
    }
    
  } catch (error) {
  }
}

testRoute();
