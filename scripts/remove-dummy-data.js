const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read .env.local file manually
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

// Parse environment variables
const envVars = {};
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && !key.startsWith('#') && valueParts.length > 0) {
    envVars[key.trim()] = valueParts.join('=').trim();
  }
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function removeDummyData() {
  console.log('🗑️  Starting to remove dummy data...\n');

  try {
    // Delete all jimpitan records
    console.log('Deleting jimpitan records...');
    const { error: jimpitanError } = await supabase
      .from('jimpitan')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records

    if (jimpitanError) {
      console.error('❌ Error deleting jimpitan:', jimpitanError.message);
    } else {
      console.log('✅ All jimpitan records deleted successfully');
    }

    // Delete all backup history records
    console.log('\nDeleting backup history records...');
    const { error: backupError } = await supabase
      .from('backup_history')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records

    if (backupError) {
      console.error('❌ Error deleting backup_history:', backupError.message);
    } else {
      console.log('✅ All backup history records deleted successfully');
    }

    // Delete all settings
    console.log('\nDeleting settings...');
    const { error: settingsError } = await supabase
      .from('pengaturan')
      .delete()
      .neq('key', 'nonexistent-key'); // Delete all records

    if (settingsError) {
      console.error('❌ Error deleting pengaturan:', settingsError.message);
    } else {
      console.log('✅ All settings deleted successfully');
    }

    console.log('\n✨ Dummy data removal completed!');
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    process.exit(1);
  }
}

removeDummyData();
