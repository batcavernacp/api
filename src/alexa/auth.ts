import axios from 'axios'

export async function getEmail (token): Promise<string> {
  const response = await axios.get('https://api.amazonalexa.com/v2/accounts/~current/settings/Profile.email', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return response.data
}
