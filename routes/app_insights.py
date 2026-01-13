import os

try:
    from opencensus.ext.azure.log_exporter import AzureLogHandler
    from opencensus.ext.azure.trace_exporter import AzureExporter
    from opencensus.trace.samplers import ProbabilitySampler
    from opencensus.trace import config_integration, tracer as tracer_module
    import logging

    CONNECTION_STRING = os.environ.get("APPLICATIONINSIGHTS_CONNECTION_STRING")

    logger = None
    tracer = None

    if CONNECTION_STRING:
        config_integration.trace_integrations(['logging'] )
        logging.basicConfig(level=logging.INFO)
        logger = logging.getLogger('comfy-swiss-army-knife')
        logger.addHandler(AzureLogHandler(connection_string=CONNECTION_STRING))
        tracer = tracer_module.Tracer(exporter=AzureExporter(connection_string=CONNECTION_STRING),
                                      sampler=ProbabilitySampler(rate=float(os.environ.get('AI_SAMPLING_RATE', '1.0'))))
        logger.info('[SAF] Application Insights logging configured')
    else:
        logger = None
        tracer = None
except Exception as exc:  # pragma: no cover - optional dependency
    logger = None
    tracer = None
    print('[SAF] Failed to initialize Application Insights instrumentation:', exc)


def get_logger():
    return logger


def get_tracer():
    return tracer
