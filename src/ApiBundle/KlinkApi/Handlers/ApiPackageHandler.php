<?php
namespace ApiBundle\KlinkApi\Handlers;

class ApiPackageHandler extends ApiHandler
{
    public function getCollections(array $data = array(), $responseFormat = null)
    {
        if (!isset($data['stores']) || empty($data['stores']) || !is_numeric($data['stores'][0]) || $data['stores'][0] == 0) {
            $data['stores'] = array(1);
        }

        return $this->makeGetRequest(
            '/collections/',
            $data,
            null,
            $responseFormat
        );
    }

    public function getPackages(array $data = array(), $responseFormat = null)
    {
        if (!isset($data['stores']) || empty($data['stores']) || !is_int($data['stores'][0]) || $data['stores'][0] == 0) {
            $data['stores'] = array(1);
        }

        return $this->makeGetRequest(
            '/packages/',
            $data,
            null,
            $responseFormat
        );
    }

    public function getPackage($id, $data, $responseFormat = null)
    {
        $route = '/packages/'.$id.'/';

        // Add store parameter to this request and have the backend return a 404 if the package is not enabled for this store.

        return $this->makeGetRequest(
            $route,
            $data,
            null,
            $responseFormat
        );
    }
}