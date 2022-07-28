"use strict";

// Class definition
var KTCreateAccount = function() {
    // Elements
    var modal;
    var modalEl;

    var stepper;
    var form;
    var formSubmitButton;
    var formContinueButton;

    // Variables
    var stepperObj;
    var validations = [];

    // Private Functions
    var initStepper = function() {
        // Initialize Stepper
        stepperObj = new KTStepper(stepper);

        // Stepper change event
        stepperObj.on('kt.stepper.changed', function(stepper) {
            if (stepperObj.getCurrentStepIndex() === 4) {
                formSubmitButton.classList.remove('d-none');
                formSubmitButton.classList.add('d-inline-block');
                formContinueButton.classList.add('d-none');
            } else if (stepperObj.getCurrentStepIndex() === 5) {
                formSubmitButton.classList.add('d-none');
                formContinueButton.classList.add('d-none');
            } else {
                formSubmitButton.classList.remove('d-inline-block');
                formSubmitButton.classList.remove('d-none');
                formContinueButton.classList.remove('d-none');
            }
        });

        // Validation before going to next page
        stepperObj.on('kt.stepper.next', function(stepper) {
            console.log('stepper.next');

            // Validate form before change stepper step
            var validator = validations[stepper.getCurrentStepIndex() - 1]; // get validator for currnt step

            if (validator) {
                validator.validate().then(function(status) {
                    console.log('validated!');

                    if (status == 'Valid') {
                        stepper.goNext();

                        KTUtil.scrollTop();
                    } else {
                        Swal.fire({
                            text: "Lo sentimos, parece que se han detectado algunos errores, inténtelo de nuevo.",
                            icon: "error",
                            buttonsStyling: false,
                            confirmButtonText: "Ok",
                            customClass: {
                                confirmButton: "btn btn-light"
                            }
                        }).then(function() {
                            KTUtil.scrollTop();
                        });
                    }
                });
            } else {
                stepper.goNext();

                KTUtil.scrollTop();
            }
        });

        // Prev event
        stepperObj.on('kt.stepper.previous', function(stepper) {
            console.log('stepper.previous');

            stepper.goPrevious();
            KTUtil.scrollTop();
        });
    }

    var handleForm = function() {
        formSubmitButton.addEventListener('click', function(e) {
            // Validate form before change stepper step
            var validator = validations[3]; // get validator for last form

            validator.validate().then(function(status) {
                console.log('validated!');

                if (status == 'Valid') {
                    // Prevent default button action
                    e.preventDefault();

                    // Disable button to avoid multiple click 
                    formSubmitButton.disabled = true;

                    // Show loading indication
                    formSubmitButton.setAttribute('data-kt-indicator', 'on');

                    // Simulate form submission
                    setTimeout(function() {
                        // Hide loading indication
                        formSubmitButton.removeAttribute('data-kt-indicator');

                        // Enable button
                        formSubmitButton.disabled = false;

                        stepperObj.goNext();
                        //KTUtil.scrollTop();
                    }, 2000);
                } else {
                    Swal.fire({
                        text: "Lo sentimos, parece que se han detectado algunos errores, inténtelo de nuevo.",
                        icon: "error",
                        buttonsStyling: false,
                        confirmButtonText: "Ok",
                        customClass: {
                            confirmButton: "btn btn-light"
                        }
                    }).then(function() {
                        KTUtil.scrollTop();
                    });
                }
            });
        });

        // Expiry month. For more info, plase visit the official plugin site: https://select2.org/
        $(form.querySelector('[name="card_expiry_month"]')).on('change', function() {
            // Revalidate the field when an option is chosen
            validations[3].revalidateField('card_expiry_month');
        });

        // Expiry year. For more info, plase visit the official plugin site: https://select2.org/
        $(form.querySelector('[name="card_expiry_year"]')).on('change', function() {
            // Revalidate the field when an option is chosen
            validations[3].revalidateField('card_expiry_year');
        });

        // Expiry year. For more info, plase visit the official plugin site: https://select2.org/
        $(form.querySelector('[name="business_type"]')).on('change', function() {
            // Revalidate the field when an option is chosen
            validations[2].revalidateField('business_type');
        });
    }

    var initValidation = function() {
        // Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
        // Step 1
        validations.push(FormValidation.formValidation(
            form, {
                fields: {
                    'cedula': {
                        validators: {
                            notEmpty: {
                                message: 'Cedula de identidad obligatoria'
                            }
                        }
                    },
                    'Expedido': {
                        validators: {
                            notEmpty: {
                                message: 'Campo obligatorio'
                            }
                        }
                    },

                    'correo': {
                        validators: {
                            notEmpty: {
                                message: 'Correo electrónico obligatoria'
                            },
                            emailAddress: {
                                message: 'El valor no es una dirección de correo electrónico válida'
                            }
                        }
                    },
                    'nombres': {
                        validators: {
                            notEmpty: {
                                message: 'Nombre(s) obligatoria'
                            }
                        }
                    },

                    'paterno': {
                        validators: {
                            notEmpty: {
                                message: 'Apellido paterno obligatorio'
                            }
                        }
                    },

                    'materno': {
                        validators: {
                            notEmpty: {
                                message: 'Apellido materno obligatorio'
                            }
                        }
                    },
                    'genero': {
                        validators: {
                            notEmpty: {
                                message: 'genero obligatorio'
                            }
                        }
                    },

                    'dia': {
                        validators: {
                            notEmpty: {
                                message: 'El dia es obligatorio'
                            }
                        }
                    },
                    'mes': {
                        validators: {
                            notEmpty: {
                                message: 'El mes es obligatorio'
                            }
                        }
                    },
                    'año': {
                        validators: {
                            notEmpty: {
                                message: 'El año es obligatorio'
                            }
                        }
                    },
                    'celular': {
                        validators: {
                            notEmpty: {
                                message: 'Numero de celular obligatoria'
                            }
                        }
                    },
                    'cuidad': {
                        validators: {
                            notEmpty: {
                                message: 'Cuidad de residencia obligatoria'
                            }
                        }
                    },

                },
                plugins: {
                    trigger: new FormValidation.plugins.Trigger(),
                    // Bootstrap Framework Integration
                    bootstrap: new FormValidation.plugins.Bootstrap5({
                        rowSelector: '.fv-row',
                        eleInvalidClass: '',
                        eleValidClass: ''
                    })
                }
            }
        ));
        // Step 2
        validations.push(FormValidation.formValidation(
            form, {
                fields: {
                    'modalidad': {
                        validators: {
                            notEmpty: {
                                message: 'Modalidad de inscripción obligatoria'
                            }
                        }
                    },
                    'transaccion': {
                        validators: {
                            notEmpty: {
                                message: 'id de transaccion obligatoria'
                            },

                        }
                    },
                    'fecha_pago': {
                        validators: {
                            notEmpty: {
                                message: 'fecha de pago obligatoria'
                            }
                        }
                    },

                    'cupon': {
                        validators: {
                            notEmpty: {
                                message: 'cupon de inscripción obligatoria'
                            }
                        }
                    },
                    'monto': {
                        validators: {
                            notEmpty: {
                                message: 'Monto obligatorio'
                            }
                        }
                    },
                    'avatar': {
                        validators: {
                            notEmpty: {
                                message: 'Seleccione una imagen'
                            },
                            file: {
                                extension: 'jpg,jpeg',
                                type: 'image/jpeg,image/png',
                                message: 'La seleccion del archivo no es valido'
                            },
                        }
                    },

                },

                plugins: {
                    trigger: new FormValidation.plugins.Trigger(),
                    // Bootstrap Framework Integration
                    bootstrap: new FormValidation.plugins.Bootstrap5({
                        rowSelector: '.fv-row',
                        eleInvalidClass: '',
                        eleValidClass: ''
                    })
                }
            }
        ));
        // Step 3
        validations.push(FormValidation.formValidation(
            form, {
                fields: {
                    'tipo_certificado': {
                        validators: {
                            notEmpty: {
                                message: 'Seleccione una opción'
                            }
                        }
                    },
                    'carga_horaria': {
                        validators: {
                            notEmpty: {
                                message: 'seleccione una opción'
                            }
                        }
                    },

                },
                plugins: {
                    trigger: new FormValidation.plugins.Trigger(),
                    // Bootstrap Framework Integration
                    bootstrap: new FormValidation.plugins.Bootstrap5({
                        rowSelector: '.fv-row',
                        eleInvalidClass: '',
                        eleValidClass: ''
                    })
                }
            }
        ));
        // Step 3
        validations.push(FormValidation.formValidation(
            form, {
                fields: {
                    'card_name': {
                        validators: {
                            notEmpty: {
                                message: 'Name on card is required'
                            }
                        }
                    },
                    'card_number': {
                        validators: {
                            notEmpty: {
                                message: 'Card member is required'
                            },
                            creditCard: {
                                message: 'Card number is not valid'
                            }
                        }
                    },
                    'card_expiry_month': {
                        validators: {
                            notEmpty: {
                                message: 'Month is required'
                            }
                        }
                    },
                    'card_expiry_year': {
                        validators: {
                            notEmpty: {
                                message: 'Year is required'
                            }
                        }
                    },
                    'card_cvv': {
                        validators: {
                            notEmpty: {
                                message: 'CVV is required'
                            },
                            digits: {
                                message: 'CVV must contain only digits'
                            },
                            stringLength: {
                                min: 3,
                                max: 4,
                                message: 'CVV must contain 3 to 4 digits only'
                            }
                        }
                    }
                },

                plugins: {
                    trigger: new FormValidation.plugins.Trigger(),
                    // Bootstrap Framework Integration
                    bootstrap: new FormValidation.plugins.Bootstrap5({
                        rowSelector: '.fv-row',
                        eleInvalidClass: '',
                        eleValidClass: ''
                    })
                }
            }
        ));



    }

    var handleFormSubmit = function() {

    }

    return {
        // Public Functions
        init: function() {
            // Elements
            modalEl = document.querySelector('#kt_modal_create_account');
            if (modalEl) {
                modal = new bootstrap.Modal(modalEl);
            }

            stepper = document.querySelector('#kt_create_account_stepper');
            form = stepper.querySelector('#kt_create_account_form');
            formSubmitButton = stepper.querySelector('[data-kt-stepper-action="submit"]');
            formContinueButton = stepper.querySelector('[data-kt-stepper-action="next"]');

            initStepper();
            initValidation();
            handleForm();
        }
    };
}();

// On document ready
KTUtil.onDOMContentLoaded(function() {
    KTCreateAccount.init();
});