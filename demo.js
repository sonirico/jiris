$(document).ready(function () {

    handleAddition();
    handleRemoval();
    handleChange();
    handleClipboard();

    initialize();
});

function initialize () {
    var $first_edit = $('#len-row-template');
    $first_edit.find('.seg-len').val(140);
    $first_edit.find('.seg-class').val('neutral');
    $first_edit.find('.seg-tags').val('span');


    var $second_edit = $('#len-row-template').clone().removeAttr('id');
    $second_edit.find('.add-row').hide();
    $second_edit.find('.remove-row').show();
    $second_edit.find('.seg-len').val(99999);
    $second_edit.find('.seg-class').val('danger');
    $second_edit.find('.seg-tags').val('em');
    $('#length').append($second_edit);

    loadSample();
}

function handleClipboard () {
    if (document.queryCommandSupported('copy') || document.queryCommandEnabled('copy')) {
        
        $('.clipboard').click(function () {
            var ct = $(this).data('copytarget');
            var target = ct ? $(ct) : null;
            
            if (target) {
                var textarea = document.createElement('textarea');
                

                var id = "aklsjfnblqiwerfpoiqvnmcxvncbv";
                textarea.id = id;
                textarea.value = target.text();
                
                document.body.appendChild(textarea);

                let reloaded_textara = document.querySelector('#' + id);
               

                try {
                    reloaded_textara.select();
                    document.execCommand('copy');
                    
                } catch (err) {
                    console.log('unable to copy');
                }

                document.body.removeChild(textarea);
            }
        });

    } else {
        $('.clipboard').hide();
    }
}

function loadSample () {
    var segments =  [];
    $(document).find('.len-row').each(function () {
        var $that = $(this);

        var seg_row = {};

        var seg_len = parseInt($that.find('.seg-len').val().trim());
        if (isNaN(seg_len) || seg_len <= 0) {
            return true;
        } else {
            seg_row['len'] = seg_len;
        }

        seg_row['className'] = $that.find('.seg-class').val().trim();
        seg_row['tag'] = $that.find('.seg-tags').val().trim();

        segments.push(seg_row);
    });

    $('#sample').jiris({
        'segments': segments
    });

    var preview = "$('#sample').jiris({'\n  segments': "+JSON.stringify(segments, null, 2)+"});";
    $('#code-preview').html(preview);
}

function handleChange () {
    $('#demo-form').on('input change', function () {
        loadSample();
    });
}

function handleRemoval () {
    $(document).on('click', '.remove-row', function () {
        $(this).parents('.len-row').remove();

        loadSample();
    });
}

function handleAddition () {
    $('.add-row').click(function () {
        var $input_container = $('#len-row-template').clone().removeAttr('id');
        $input_container.find('.add-row').remove();
        $input_container.find('.remove-row').show();
        $('#length').append($input_container);

        loadSample();
    });
}