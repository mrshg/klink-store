<?php
namespace ApiBundle\KlinkApi\Handlers;

class ApiCategoriesHandler extends ApiHandler
{
    public function getCategories(array $data = array(), $responseFormat = null)
    {
        if (!isset($data['stores']) || empty($data['stores']) || !is_numeric($data['stores'][0]) || $data['stores'][0] == 0) {
            $data['stores'] = array(1);
        }

        return $this->makeGetRequest(
            '/categories/',
            $data,
            null,
            $responseFormat
        );
    }
}