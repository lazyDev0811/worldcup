<script>
jQuery(document).ready(function() {

    jQuery(".hover-home .form-group input").each(function() {
        if (jQuery(this).val().length > 0) {
            jQuery(this).closest(".form-group").addClass("hasvalue");
        } else {
            jQuery(this).closest(".form-group").removeClass("hasvalue");
        }
    });
    jQuery(".hover-home .form-group input").on("input", function() {
        if (jQuery(this).val().length > 0) {
            jQuery(this).closest(".form-group").addClass("hasvalue");
        } else {
            jQuery(this).closest(".form-group").removeClass("hasvalue");
        }
    });
});
</script>
