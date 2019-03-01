var categories = {

    updateHeaderDropdown: function (assetUrl) {
        apiHandler.getCategories().then(function (data) {
                var html = '<ul>';
                $.each(data, function (index, val) {
                    if (index > 2) {
                        return false;
                    }
                    html += '<li><a href="' +assetUrl+ 'browse/' + val.id + '">' + val.name + '</a></li>';
                });

                html += '<li><a href="' +assetUrl+ 'browse/">More...</a></li></ul>';
                $('.browse-dropdown').html(html);
            })
        ;

    }
};