let token = null;

export const setToken = async (password) => {
  const res = await fetch('token', {
    method: 'POST',
    body: JSON.stringify({ pwd: password }),
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (res.status === 200) {
    const txt = await res.text();
    token = txt;
  } else {
    token = null;
  }
  return token;
};

export const getToken = () => token;
