<?php
namespace ApiBundle\KlinkApi\Handlers;

class ApiHomeHandler extends ApiHandler
{
    public function getHome(array $data = array(1), $responseFormat = null)
    {
        if (!isset($data['stores']) || empty($data['stores']) || !is_numeric($data['stores'][0]) || $data['stores'][0] == 0) {
            $data['stores'] = array(1);
        }

        return $this->makeGetRequest(
            '/home/',
            $data,
            null,
            $responseFormat
        );
    }

}