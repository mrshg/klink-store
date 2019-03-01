<?php
namespace ApiBundle\KlinkApi\Handlers;

use Buzz\Client\Curl;
use Buzz\Message\Form\FormRequest;
use Buzz\Browser;
use Symfony\Component\HttpFoundation\JsonResponse;
use Buzz\Message\Response;
use Symfony\Component\Security\Core\Exception\AuthenticationException;

class ApiHandler
{
    /**
     * @var array
     */
    protected $apiSettings;

    /**
     * @var
     */
    private $browser;

    public function __construct($apiSettings)
    {
        if (!array_key_exists('klink_api_end_point', $apiSettings)) {
            throw new \Exception('For Klink Api API_ENDPOINT is missing');
        }

        if (!array_key_exists('klink_api_client_id', $apiSettings)) {
            throw new \Exception('For Klink Api CLIENT_ID is missing');
        }

        if (!array_key_exists('klink_api_client_secret', $apiSettings)) {
            throw new \Exception('For Klink Api CLIENT_SECRET is missing');
        }

        $this->apiSettings = $apiSettings;
        $this->browser = new Browser(new Curl());
    }

    public function makePostRequest($route, $params = null, $headers = null, $responseFormat = null)
    {
        return $this->makeRequest(FormRequest::METHOD_POST, $params, $route, $headers, $responseFormat);
    }

    public function makePutRequest($route, $params = null, $headers = null, $responseFormat = null)
    {
        return $this->makeRequest(FormRequest::METHOD_PUT, $params, $route, $headers, $responseFormat);
    }

    public function makeDeleteRequest($route, $params = null, $headers = null, $responseFormat = null)
    {
        return $this->makeRequest(FormRequest::METHOD_DELETE, $params, $route, $headers, $responseFormat);
    }

    public function makePatchRequest($route, $params = null, $headers = null, $responseFormat = null)
    {
        return $this->makeRequest(FormRequest::METHOD_PATCH, $params, $route, $headers, $responseFormat);
    }

    public function makeGetRequest($route, $params = null, $headers = null, $responseFormat = null)
    {
        return $this->makeRequest(FormRequest::METHOD_GET, $params, $route, $headers, $responseFormat);
    }

    private function makeRequest($method, $params = null, $route, $headers = null, $responseFormat = null)
    {
        $request = new FormRequest(
            $method,
            $route,
            $this->apiSettings['klink_api_end_point']
        );

        if($params) {
            $request->setFields($params);
        }

        if($headers) {
            $request->setHeaders($headers);
        }

        return $this->sendRequest($request, $responseFormat);
    }

    private function sendRequest($request, $responseFormat = null)
    {
        $this->browser->getClient()->setTimeout(10000);
        /**
         * @var Response $response
         */
        $response =  $this->browser->send($request);

        if($responseFormat == 'array') {
            return json_decode($response->getContent(), true);
        }

        return new JsonResponse(json_decode($response->getContent()), $response->getStatusCode());
    }

}