// Request tracking
const pendingRequests = new Map<string, { resolve: (value: any) => void; reject: (error: any) => void }>();

export const useNginxApi = () => {
  const { $webSocket } = useNuxtApp();

  const sendRequest = (request: string, data?: any): Promise<any> => {
    return new Promise((resolve, reject) => {
      const requestId = `${request}_${Date.now()}_${Math.random()}`;
      const message = { request, data, requestId };

      // Store the promise handlers
      pendingRequests.set(requestId, { resolve, reject });

      // Send the request
      $webSocket.send(JSON.stringify(message));

      // Timeout after 30 seconds
      setTimeout(() => {
        if (pendingRequests.has(requestId)) {
          pendingRequests.delete(requestId);
          reject(new Error('Request timeout'));
        }
      }, 30000);
    });
  };

  const updateSite = async (siteName: string, content: string, enabled: boolean, override: boolean = false) => {
    return await sendRequest('updateSite', {
      siteName,
      content,
      enabled,
      override
    });
  };

  const deleteSite = async (siteName: string) => {
    return await sendRequest('deleteSite', { siteName });
  };

  const getSites = async () => {
    const response = await sendRequest('getSites');
    return response.sites || [];
  };

  const createSite = async (siteName: string, content?: string, enabled: boolean = false) => {
    return await sendRequest('createSite', { siteName, content, enabled });
  };

  const getCertificates = async () => {
    const response = await sendRequest('getCertificates');
    return response.certificates || [];
  };

  const createCertificate = async (domains: string[], email?: string) => {
    return await sendRequest('createCertificate', { domains, email });
  };

  const renewCertificate = async (certName?: string) => {
    return await sendRequest('renewCertificate', { certName });
  };

  const deleteCertificate = async (certName: string) => {
    return await sendRequest('deleteCertificate', { certName });
  };

  const uploadCertificate = async (certName: string, certContent: string, keyContent: string, chainContent?: string) => {
    return await sendRequest('uploadCertificate', { certName, certContent, keyContent, chainContent });
  };

  const getCertificateConfig = async (certName: string, serverName?: string) => {
    const response = await sendRequest('getCertificateConfig', { certName, serverName });
    return response.config || '';
  };

  return {
    sendRequest,
    updateSite,
    deleteSite,
    getSites,
    createSite,
    getCertificates,
    createCertificate,
    renewCertificate,
    deleteCertificate,
    uploadCertificate,
    getCertificateConfig
  };
};

// Export function to handle responses from WebSocket
export const handleNginxApiResponse = (response: any) => {
  if (response.requestId && pendingRequests.has(response.requestId)) {
    const { resolve } = pendingRequests.get(response.requestId)!;
    pendingRequests.delete(response.requestId);
    resolve(response);
    return true; // Indicate that we handled this response
  }
  return false; // Indicate that this response wasn't for us
};
