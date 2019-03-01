<?php
namespace AppBundle\Controller\Ajax;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class ProductController extends Controller
{
    public function getProductModalAction($productName)
    {
        $stores = $this->get('klink_api_store_handler')->getStoreIds();

        $data = array(
            'stores' => $stores,
            'name' => $productName,
        );

        $products = $this->get('klink_api_product_handler')->getProducts($data, 'array');

        return $this->render(
            'AppBundle:Modals/Includes:drink.html.twig',
            array(
                'products' => $products,
            )
        );
    }

    public function getProductsByCategoriesAndPageAction(Request $request)
    {
        $data = $request->query->all();

        $products = $this->get('klink_api_product_handler')->getProducts($data, 'array');

        if (!isset($products['items'])) {
            return new JsonResponse(array(
                'contentHtml' => '<div class="no-products"><p>There are no products in selected category.</p></div>'
            ));
        }

        return new JsonResponse(
            array(
                'contentHtml' => $this->renderView(
                    'AppBundle:_Includes:browse-drink-item.html.twig',
                    array(
                        'products' => $products,
                    )
                ),
                'hasMore' => ($products['page'] != $products['pages']) ? true : false,
            )
        );
    }
}