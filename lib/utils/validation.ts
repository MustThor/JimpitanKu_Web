export const validateJimpitanInput = (data: {
  amount: string | number;
  collection_date: string;
  notes?: string;
  photo?: File | null;
}): { valid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  // Validate amount
  const amount = typeof data.amount === 'string' ? parseInt(data.amount, 10) : data.amount;
  if (!data.amount || isNaN(amount) || amount <= 0) {
    errors.amount = 'Jumlah harus lebih dari 0';
  }

  // Validate collection_date
  if (!data.collection_date) {
    errors.collection_date = 'Tanggal wajib diisi';
  } else {
    const date = new Date(data.collection_date);
    if (isNaN(date.getTime())) {
      errors.collection_date = 'Format tanggal tidak valid';
    } else if (date > new Date()) {
      errors.collection_date = 'Tanggal tidak boleh di masa depan';
    }
  }

  // Optional photo validation
  if (data.photo) {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(data.photo.type)) {
      errors.photo = 'Format file tidak didukung. Gunakan JPG, PNG, atau WebP.';
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (data.photo.size > maxSize) {
      errors.photo = 'Ukuran file terlalu besar. Maksimal 5MB.';
    }
  }

  // Notes is optional, no validation needed

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateSettingsInput = (data: {
  app_name?: string;
  nominal_default?: string;
  theme?: string;
}): { valid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  // Validate app_name
  if (data.app_name !== undefined) {
    if (!data.app_name || data.app_name.trim().length === 0) {
      errors.app_name = 'Nama aplikasi tidak boleh kosong';
    } else if (data.app_name.length > 100) {
      errors.app_name = 'Nama aplikasi maksimal 100 karakter';
    }
  }

  // Validate nominal_default
  if (data.nominal_default !== undefined) {
    const nominal = parseInt(data.nominal_default, 10);
    if (isNaN(nominal) || nominal <= 0) {
      errors.nominal_default = 'Nominal default harus lebih dari 0';
    }
  }

  // Validate theme
  if (data.theme !== undefined) {
    if (!['light', 'dark'].includes(data.theme)) {
      errors.theme = 'Tema harus light atau dark';
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};
