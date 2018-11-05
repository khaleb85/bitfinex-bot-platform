import request from 'request-promise';
import hydra from 'hydra';
import Debug from '../tools/debug';

/**
 * Service that make comunication with other microservices
 *
 * @class ServiceComunication
 */
class ServiceComunication {
    /**
     * Makes a POST request in the given microservice in the endpoint passed
     *
     * @param {string} serviceName
     * @param {string} endpoint
     * @param {object} data
     * @returns {Promise<html>} htmlAsString
     */
    static makePostRequest(serviceName, endpoint, data) {
        return new Promise((resolve) => {
            this._discoveryServiceIp(serviceName).then(url => {
                if (!url) {
                    Debug.error(`The service ${serviceName} is innacesible at this moment.`);
                    return resolve(null);
                }

                request.post({
                    url: `${url}${endpoint}`,
                    json: data,
                }).then((html) => {
                    resolve(html);
                });
            });
        });
    }

    /**
     * Makes a GET request in the given microservice in the endpoint passed
     *
     * @param {string} serviceName
     * @param {string} endpoint
     * @returns {Promise<html>} htmlAsString
     */
    static makeGetRequest(serviceName, endpoint) {
        return new Promise((resolve) => {
            this._discoveryServiceIp(serviceName).then(url => {
                if (!url) {
                    Debug.error(`The service ${serviceName} is innacesible at this moment.`);
                    return resolve(null);
                }

                request.get({
                    url: `${url}${endpoint}`,
                }).then(html => {
                    resolve(html);
                });
            });
        });
    }

    /**
     * Returns the ip and port of the microservice with the given name
     *
     * @param {string} serviceName
     * @returns {string} ip:port
     */
    static _discoveryServiceIp(serviceName) {
        return new Promise((resolve, reject) => {
            const mockIps = process.env.MOCK_IP;
            if (mockIps) {
                const obj = JSON.parse(process.env.MOCK_IP);
                if (obj[serviceName]) {
                    return resolve(`http://${obj[serviceName]}`);
                }
            }

            hydra.getServicePresence(serviceName).then(service => {
                if (Array.isArray(service)) {
                    if (!service[0] || !service[0].ip) { return resolve(); }
                    const uniqueIps = [...new Set(service.map(item => item.Name))];
                    const uniquePorts = [...new Set(service.map(item => item.Name))];

                    if (uniqueIps.length > 1 || uniquePorts > 1) {
                        return reject(new Error('Many services with same name'));
                    }

                    return resolve(`http://${service[0].ip}:${service[0].port}`);
                }

                if (!service || !service.ip) { return resolve(null); }
                return resolve(`${service.ip}:${service.port}`);
            });
        });
    }
}

export default ServiceComunication;
